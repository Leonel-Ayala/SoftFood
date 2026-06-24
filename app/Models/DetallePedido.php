<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['pedido_id', 'producto_id', 'cantidad', 'precio_unitario', 'subtotal'])]
class DetallePedido extends Model
{
    protected $table = 'detalle_pedidos'; 

    public function pedido()
    {
        return $this->belongsTo(Pedido::class, 'pedido_id');
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }
}