<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pedidos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('users');
            $table->integer('total');
            $table->enum('metodo_pago', ['efectivo', 'debito', 'credito']);
            $table->integer('monto_entregado');
            $table->integer('vuelto');
            $table->enum('estado', ['pendiente', 'listo', 'anulado'])->default('pendiente');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pedidos');
    }
};