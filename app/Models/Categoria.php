<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['nombre', 'activo'])]
class Categoria extends Model
{
    public function productos()
    {
        return $this->hasMany(Producto::class, 'categoria_id');
    }
}