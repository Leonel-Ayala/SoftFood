<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CocinaController extends Controller
{
    // Mostrar la pantalla con los pedidos pendientes
    public function index()
    {
        // Traemos los pedidos en estado 'pendiente', ordenados del más antiguo al más nuevo (FIFO)
        // Y cargamos la relación con el detalle y el nombre del producto
        $pedidos = Pedido::with(['detalles.producto'])
            ->where('estado', 'pendiente')
            ->orderBy('created_at', 'asc')
            ->get();

        return Inertia::render('Cocina/Index', [
            'pedidos' => $pedidos
        ]);
    }

    // Cambiar el estado del pedido a 'listo'
    public function marcarListo(Pedido $pedido)
    {
        $pedido->update(['estado' => 'listo']);
        
        return redirect()->back();
    }
}