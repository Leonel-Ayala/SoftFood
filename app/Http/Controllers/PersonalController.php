<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class PersonalController extends Controller
{
    // 1. Listar a todos los miembros del equipo
    public function index()
    {
        $usuarios = User::orderBy('id', 'desc')->get();

        return Inertia::render('Admin/Personal', [
            'usuarios' => $usuarios
        ]);
    }

    // 2. Registrar un nuevo empleado
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'rol' => 'required|string|in:admin,cajero,cocinero', // Cambiado a 'rol'
        ]);

        User::create([
            'nombre' => $request->nombre,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'rol' => $request->rol,
            'activo' => true, // El modelo exige este campo
        ]);

        return redirect()->back();
    }

    // 3. Eliminar o dar de baja a un empleado
    public function destroy(User $user)
    {
        if (auth()->id() === $user->id) {
            return redirect()->back()->withErrors(['error' => 'No puedes eliminar tu propio usuario activo.']);
        }

        $user->delete();

        return redirect()->back();
    }
}