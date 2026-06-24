<?php

namespace App\Http\Controllers;

use App\Models\CierreCaja;
use App\Models\Pedido;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CierreCajaController extends Controller
{
    // 1. Mostrar el panel de cierres con los montos sugeridos por el sistema
    public function index()
    {
        // Traemos el historial de cierres ordenados por el más reciente, cargando el usuario que lo hizo
        $cierres = CierreCaja::with('usuario')->orderBy('id', 'desc')->get();

        // Calculamos las ventas acumuladas del día de hoy para sugerir el cuadre
        $hoy = Carbon::today();
        $ventasEfectivo = Pedido::whereDate('created_at', $hoy)->where('metodo_pago', 'efectivo')->sum('total');
        $ventasDebito = Pedido::whereDate('created_at', $hoy)->where('metodo_pago', 'debito')->sum('total');

        return Inertia::render('Admin/Caja', [
            'cierres' => $cierres,
            'valoresSistema' => [
                'efectivo' => (int) $ventasEfectivo,
                'debito' => (int) $ventasDebito,
                'total' => (int) ($ventasEfectivo + $ventasDebito)
            ]
        ]);
    }

    // 2. Guardar el acta de cierre de caja en la base de datos
    public function store(Request $request)
    {
        $request->validate([
            'monto_apertura' => 'required|integer|min:0',
            'monto_sistema_efectivo' => 'required|integer|min:0',
            'monto_sistema_debito' => 'required|integer|min:0',
            'monto_real_efectivo' => 'required|integer|min:0',
            'monto_real_debito' => 'required|integer|min:0',
            'observaciones' => 'nullable|string',
        ]);

        // Calculamos la diferencia matemática final (Monto Real - Monto Sistema)
        $totalSistema = $request->monto_sistema_efectivo + $request->monto_sistema_debito;
        $totalReal = $request->monto_real_efectivo + $request->monto_real_debito;
        $diferencia = $totalReal - $totalSistema;

        CierreCaja::create([
            'usuario_id' => auth()->id(), // El ID del administrador o cajero logueado
            'monto_apertura' => $request->monto_apertura,
            'monto_sistema_efectivo' => $request->monto_sistema_efectivo,
            'monto_sistema_debito' => $request->monto_sistema_debito,
            'monto_real_efectivo' => $request->monto_real_efectivo,
            'monto_real_debito' => $request->monto_real_debito,
            'diferencia' => $diferencia,
            'observaciones' => $request->observaciones,
        ]);

        return redirect()->back();
    }
}