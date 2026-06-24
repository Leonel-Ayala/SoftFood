<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use App\Models\Categoria;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductoController extends Controller
{
    // 1. Mostrar la pantalla con productos y categorías
    public function index()
    {
        $productos = Producto::with('categoria')->orderBy('id', 'desc')->get();
        $categorias = Categoria::all();

        return Inertia::render('Admin/Menu', [
            'productos' => $productos,
            'categorias' => $categorias
        ]);
    }

    // 2. Guardar un nuevo producto
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'precio' => 'required|integer|min:0',
            'categoria_id' => 'required|exists:categorias,id',
        ]);

        Producto::create([
            'nombre' => $request->nombre,
            'precio' => $request->precio,
            'categoria_id' => $request->categoria_id,
            'activo' => true,
        ]);

        return redirect()->back();
    }

    // 3. NUEVO: Guardar una nueva categoría
    public function storeCategoria(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255|unique:categorias,nombre',
        ]);

        Categoria::create([
            'nombre' => $request->nombre,
            'activo' => true, // Por defecto entra activa
        ]);

        return redirect()->back();
    }

    // 4. Activar / Desactivar un producto
    public function toggleActivo(Producto $producto)
    {
        $producto->update(['activo' => !$producto->activo]);
        
        return redirect()->back();
    }
    // 5. Activar / Desactivar una categoría
    public function toggleActivoCategoria(Categoria $categoria)
    {
        $categoria->update(['activo' => !$categoria->activo]);
        
        return redirect()->back()->with('success', 'Estado de categoría actualizado');
    }
}