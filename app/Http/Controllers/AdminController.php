<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use App\Models\Producto;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminController extends Controller
{
    // EL POLICÍA DE TRÁFICO: Redirección automática al loguearse
    public function dashboard()
    {
        $usuario = auth()->user();

        // 1. Si es cajero, lo mandamos directo al Punto de Venta
        if ($usuario->rol === 'cajero') {
            return redirect()->route('caja.index');
        }

        // 2. Si es cocinero, lo mandamos directo a la pantalla de Cocina
        if ($usuario->rol === 'cocinero') {
            return redirect()->route('cocina.index');
        }

        // 3. SI ES ADMIN: Cargamos las variables del panel de control
        $ventasHoy = Pedido::whereDate('created_at', Carbon::today())->sum('total');
        $pedidosHoy = Pedido::whereDate('created_at', Carbon::today())->count();
        $productosActivos = Producto::where('activo', true)->count();

        return Inertia::render('Admin/Dashboard', [
            'ventasHoy' => (int) $ventasHoy,
            'pedidosHoy' => $pedidosHoy,
            'productosActivos' => $productosActivos
        ]);
    }

    // MONITOR DE VENTAS Y ANALÍTICA EN VIVO
    public function reportes()
    {
        $hoy = Carbon::today();

        // 1. Totales de dinero y pedidos del día
        $ventasTotales = Pedido::whereDate('created_at', $hoy)->sum('total');
        $cantidadPedidos = Pedido::whereDate('created_at', $hoy)->count();
        
        // 2. Desglose por método de pago
        $ventasEfectivo = Pedido::whereDate('created_at', $hoy)->where('metodo_pago', 'efectivo')->sum('total');
        $ventasDebito = Pedido::whereDate('created_at', $hoy)->where('metodo_pago', 'debito')->sum('total');

        // 3. Aluvión de ventas: Los 5 productos más vendidos hoy (Ranking en vivo)
        $topProductos = DB::table('detalle_pedidos')
            ->join('productos', 'detalle_pedidos.producto_id', '=', 'productos.id')
            ->join('pedidos', 'detalle_pedidos.pedido_id', '=', 'pedidos.id')
            ->whereDate('pedidos.created_at', $hoy)
            ->select('productos.nombre', DB::raw('SUM(detalle_pedidos.cantidad) as total_cantidad'))
            ->groupBy('productos.id', 'productos.nombre')
            ->orderBy('total_cantidad', 'desc')
            ->take(5)
            ->get();

        // 4. El feed de auditoría: Últimos 15 pedidos ingresados
        $ultimosPedidos = Pedido::with('detalles.producto')
            ->whereDate('created_at', $hoy)
            ->orderBy('created_at', 'desc')
            ->take(15)
            ->get();

        return Inertia::render('Admin/Reportes', [
            'stats' => [
                'total' => (int) $ventasTotales,
                'cantidad' => $cantidadPedidos,
                'efectivo' => (int) $ventasEfectivo,
                'debito' => (int) $ventasDebito,
            ],
            'topProductos' => $topProductos,
            'ultimosPedidos' => $ultimosPedidos
        ]);
    }
}