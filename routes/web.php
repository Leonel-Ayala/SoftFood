<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CajaController;
use App\Http\Controllers\CocinaController;
use App\Http\Controllers\AdminController; 
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\PersonalController; 
use App\Http\Controllers\CierreCajaController;

Route::redirect('/', '/login');

// RUTAS DE ADMINISTRACIÓN Y GESTIÓN
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/admin/reportes', [AdminController::class, 'reportes'])->name('admin.reportes');
    
    // RUTAS DE MENÚ
    Route::get('/admin/menu', [ProductoController::class, 'index'])->name('admin.menu');
    Route::post('/admin/menu', [ProductoController::class, 'store'])->name('admin.menu.store');
    Route::post('/admin/categorias', [ProductoController::class, 'storeCategoria'])->name('admin.categoria.store');
    Route::put('/admin/menu/{producto}/toggle', [ProductoController::class, 'toggleActivo'])->name('admin.menu.toggle');
    Route::patch('/admin/categorias/{categoria}/toggle', [ProductoController::class, 'toggleActivoCategoria'])->name('categorias.toggle');
    // RUTAS DE PERSONAL
    Route::get('/admin/personal', [PersonalController::class, 'index'])->name('admin.personal');
    Route::post('/admin/personal', [PersonalController::class, 'store'])->name('admin.personal.store');
    Route::delete('/admin/personal/{user}', [PersonalController::class, 'destroy'])->name('admin.personal.destroy');

    // RUTAS DE CIERRE DE CAJA <-- NUEVAS RUTAS
    Route::get('/admin/caja', [CierreCajaController::class, 'index'])->name('admin.caja');
    Route::post('/admin/caja', [CierreCajaController::class, 'store'])->name('admin.caja.store');
});

// RUTAS OPERATIVAS
Route::get('/caja', [CajaController::class, 'index'])->name('caja.index');
Route::post('/pedidos', [CajaController::class, 'store'])->name('pedidos.store');
Route::get('/cocina', [CocinaController::class, 'index'])->name('cocina.index');
Route::put('/pedidos/{pedido}/listo', [CocinaController::class, 'marcarListo'])->name('pedidos.listo');

require __DIR__.'/settings.php';