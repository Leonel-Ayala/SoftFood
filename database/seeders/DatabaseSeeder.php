<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Categoria;
use App\Models\Producto;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. CREACIÓN DE USUARIOS DE PRUEBA
        // Cuenta de Administrador para el Login completo
        User::create([
            'nombre' => 'Administrador SoftFood',
            'email' => 'admin@softfood.com',
            'password' => Hash::make('admin123'), // Contraseña para el panel
            'rol' => 'administrador',
            'activo' => true,
        ]);

        // Cuenta de Cajero para acceso rápido por PIN
        User::create([
            'nombre' => 'Cajero Turno Tarde',
            'pin_acceso' => '1234', // PIN de 4 dígitos para la Caja
            'rol' => 'cajero',
            'activo' => true,
        ]);


        // 2. CREACIÓN DE CATEGORÍAS DEL MENÚ
        $catHamburguesas = Categoria::create(['nombre' => 'Hamburguesas']);
        $catAcompanamientos = Categoria::create(['nombre' => 'Acompañamientos']);
        $catBebidas = Categoria::create(['nombre' => 'Bebidas']);


        // 3. CREACIÓN DE PRODUCTOS
        // Hamburguesas
        Producto::create([
            'categoria_id' => $catHamburguesas->id,
            'nombre' => 'Big Burger Attack Simple',
            'precio' => 5500,
            'activo' => true,
        ]);

        Producto::create([
            'categoria_id' => $catHamburguesas->id,
            'nombre' => 'Big Burger Attack Doble',
            'precio' => 6800,
        ]);

        Producto::create([
            'categoria_id' => $catHamburguesas->id,
            'nombre' => 'Combo Especial 7 Estrellas',
            'precio' => 8900,
            'activo' => true,
        ]);

        // Acompañamientos
        Producto::create([
            'categoria_id' => $catAcompanamientos->id,
            'nombre' => 'Papas Fritas Medianas',
            'precio' => 1800,
            'activo' => true,
        ]);

        Producto::create([
            'categoria_id' => $catAcompanamientos->id,
            'nombre' => 'Papas Fritas Grandes',
            'precio' => 2500,
            'activo' => true,
        ]);

        // Bebidas
        Producto::create([
            'categoria_id' => $catBebidas->id,
            'nombre' => 'Bebida Lata 350ml',
            'precio' => 1500,
            'activo' => true,
        ]);

        Producto::create([
            'categoria_id' => $catBebidas->id,
            'nombre' => 'Jugo Natural',
            'precio' => 2200,
            'activo' => true,
        ]);
    }
}