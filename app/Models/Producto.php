<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['categoria_id', 'nombre', 'precio', 'imagen_url', 'activo'])]
class Producto extends Model
{
    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'categoria_id');
    }

    public function detalles()
    {
        return $this->hasMany(DetallePedido::class, 'producto_id');
    }
}