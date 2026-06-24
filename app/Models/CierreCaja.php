<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CierreCaja extends Model
{
    use HasFactory;

    // El nombre de la tabla en la base de datos (por si acaso)
    protected $table = 'cierres_cajas';

    // Autorizamos qué columnas se pueden llenar desde el formulario
    protected $fillable = [
        'usuario_id',
        'monto_apertura',
        'monto_sistema_efectivo',
        'monto_sistema_debito',
        'monto_real_efectivo',
        'monto_real_debito',
        'diferencia',
        'observaciones',
    ];

    // Relación: Un cierre de caja pertenece a un usuario (cajero o admin)
    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }
}