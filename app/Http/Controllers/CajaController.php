<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use App\Models\Pedido;
use App\Models\DetallePedido;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CajaController extends Controller
{
    // MÉTODO PARA MOSTRAR LA PANTALLA
    public function index()
    {
        $categorias = Categoria::where('activo', 1)
        ->with(['productos' => function($query) {
            $query->where('activo', 1); // Si también tienes productos inactivos, filtra aquí también
        }])
        ->get();

        return inertia('Caja/Index', [
            'categorias' => $categorias
        ]);
    }

    // MÉTODO PARA GUARDAR LA VENTA
    public function store(Request $request)
    {
        // 1. Validar que la información que llega de React es correcta
        $request->validate([
            'total' => 'required|integer',
            'metodo_pago' => 'required|in:efectivo,debito,credito',
            'monto_entregado' => 'required|integer',
            'vuelto' => 'required|integer',
            'productos' => 'required|array',
        ]);

        // 2. Usar una transacción (Si la base de datos falla a la mitad, se revierte todo y no hay datos corruptos)
        DB::transaction(function () use ($request) {

            // A. Guardar el Pedido Cabecera
            $pedido = Pedido::create([
                // Si aún no configuras el login, usamos el usuario 1 (Admin) por defecto para que no de error
                'usuario_id' => auth()->id() ?? 1, 
                'total' => $request->total,
                'metodo_pago' => $request->metodo_pago,
                'monto_entregado' => $request->monto_entregado,
                'vuelto' => $request->vuelto,
                'estado' => 'pendiente', // Entra como pendiente para el módulo de cocina
            ]);

            // B. Recorrer el carrito y guardar cada producto en el Detalle
            foreach ($request->productos as $item) {
                DetallePedido::create([
                    'pedido_id' => $pedido->id,
                    'producto_id' => $item['producto_id'],
                    'cantidad' => $item['cantidad'],
                    'precio_unitario' => $item['precio_unitario'],
                    'subtotal' => $item['subtotal'],
                ]);
            }
        });

        // 3. Redirigir de vuelta a la página (Inertia se encarga de que esto ocurra sin recargar la pantalla)
        return redirect()->back();
    }
}