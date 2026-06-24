import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';

interface Producto {
    id: number;
    nombre: string;
    precio: number;
}

interface Categoria {
    id: number;
    nombre: string;
    productos: Producto[];
}

interface Props {
    categorias: Categoria[];
}

// Estructura interna para los elementos del carrito
interface ItemCarrito {
    producto: Producto;
    cantidad: number;
}

export default function CajaIndex({ categorias }: Props) {
    // ESTADOS DEL MÓDULO DE CAJA
    const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
    const [metodoPago, setMetodoPago] = useState<'efectivo' | 'debito' | 'credito'>('efectivo');
    const [montoEntregado, setMontoEntregado] = useState<number | string>('');
    
    // NUEVO ESTADO: Memoria para saber qué categoría estamos viendo
    // Por defecto, selecciona el ID de la primera categoría (si existe)
    const [categoriaActiva, setCategoriaActiva] = useState<number | undefined>(categorias[0]?.id);

    // 1. FUNCIÓN PARA AGREGAR UN PRODUCTO AL CARRITO
    const agregarAlCarrito = (producto: Producto) => {
        setCarrito((carritoActual) => {
            const existe = carritoActual.find(item => item.producto.id === producto.id);
            if (existe) {
                return carritoActual.map(item => 
                    item.producto.id === producto.id 
                        ? { ...item, cantidad: item.cantidad + 1 } 
                        : item
                );
            }
            return [...carritoActual, { producto, cantidad: 1 }];
        });
    };

    // 2. FUNCIÓN PARA QUITAR O DECREMENTAR UN PRODUCTO
    const quitarDelCarrito = (productoId: number) => {
        setCarrito((carritoActual) => {
            const item = carritoActual.find(i => i.producto.id === productoId);
            if (item && item.cantidad > 1) {
                return carritoActual.map(i => 
                    i.producto.id === productoId ? { ...i, cantidad: i.cantidad - 1 } : i
                );
            }
            return carritoActual.filter(i => i.producto.id !== productoId);
        });
    };

    // 3. CALCULO DEL TOTAL GLOBAL
    const total = carrito.reduce((suma, item) => suma + (item.producto.precio * item.cantidad), 0);

    // 4. CALCULO DEL VUELTO (Solo aplica para pago en Efectivo)
    const vuelto = metodoPago === 'efectivo' && Number(montoEntregado) >= total
        ? Number(montoEntregado) - total
        : 0;

    // 5. ENVIAR PEDIDO A LA BASE DE DATOS
    const procesarVenta = () => {
        if (carrito.length === 0) {
            alert('Debes agregar al menos un producto a la comanda.');
            return;
        }

        if (metodoPago === 'efectivo' && Number(montoEntregado) < total) {
            alert('El monto entregado es menor al total de la venta.');
            return;
        }

        const datosPedido = {
            total: total,
            metodo_pago: metodoPago,
            monto_entregado: metodoPago === 'efectivo' ? Number(montoEntregado) : total,
            vuelto: vuelto,
            productos: carrito.map(item => ({
                producto_id: item.producto.id,
                cantidad: item.cantidad,
                precio_unitario: item.producto.precio,
                subtotal: item.producto.precio * item.cantidad
            }))
        };

        router.post('/pedidos', datosPedido, {
            onSuccess: () => {
                setCarrito([]);
                setMontoEntregado('');
                setMetodoPago('efectivo');
                alert('¡Venta realizada con éxito! Enviado a cocina.');
            },
            onError: (err) => {
                console.error(err);
                alert('Hubo un error al procesar la venta.');
            }
        });
    };

    // NUEVO: Filtramos los productos para mostrar SOLO los de la categoría activa
    const categoriaSeleccionada = categorias.find(c => c.id === categoriaActiva);
    const productosAMostrar = categoriaSeleccionada ? categoriaSeleccionada.productos : [];

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden font-sans">
            <Head title="Caja - SoftFood" />
            
            {/* ================= SECCIÓN IZQUIERDA: CATÁLOGO DE MENÚ (65% Ancho) ================= */}
            <div className="w-2/3 p-6 flex flex-col h-full border-r border-gray-200">
                
                <header className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-200/60 shadow-sm shrink-0">
                    <div>
                        <h1 className="text-2xl font-black text-gray-800 tracking-tight">MÓDULO DE CAJA</h1>
                        <p className="text-gray-500 text-sm font-medium">Navega por las categorías para armar el pedido</p>
                    </div>

                    <Link 
                        href="/admin/caja" 
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-xl flex items-center gap-2 transition-all active:scale-95 text-xs uppercase tracking-wider shadow-sm shadow-red-100 shrink-0"
                    >
                        <span>🔒</span> Cerrar Turno
                    </Link>
                </header>

                {/* NUEVO: BARRA TÁCTIL DE CATEGORÍAS */}
                <div className="flex gap-3 overflow-x-auto pb-4 mb-2 border-b border-gray-200 shrink-0" style={{ scrollbarWidth: 'none' }}>
                    {categorias.map(categoria => (
                        <button
                            key={categoria.id}
                            onClick={() => setCategoriaActiva(categoria.id)}
                            className={`min-w-[140px] px-6 py-4 rounded-xl font-black text-sm uppercase transition-all duration-200 whitespace-nowrap shadow-sm ${
                                categoriaActiva === categoria.id
                                    ? 'bg-slate-900 text-white scale-105 border-transparent'
                                    : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-slate-800'
                            }`}
                        >
                            {categoria.nombre}
                        </button>
                    ))}
                </div>

                {/* NUEVO: CUADRÍCULA DE PRODUCTOS FILTRADOS */}
                <div className="flex-1 overflow-y-auto pt-2">
                    {productosAMostrar.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-8">
                            {productosAMostrar.map(producto => (
                                <button 
                                    key={producto.id} 
                                    className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md hover:border-blue-500 border-2 border-transparent transition-all flex flex-col items-center justify-between text-center h-32 active:scale-95 bg-gradient-to-b from-white to-gray-50"
                                    onClick={() => agregarAlCarrito(producto)}
                                >
                                    <span className="font-bold text-gray-800 leading-snug text-sm">
                                        {producto.nombre}
                                    </span>
                                    <span className="text-blue-600 font-extrabold text-base">
                                        ${producto.precio.toLocaleString('es-CL')}
                                    </span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3">
                            <span className="text-5xl">🍔</span>
                            <p className="font-bold text-lg text-slate-500">No hay productos en esta categoría</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ================= SECCIÓN DERECHA: COMANDA / BOLETA DIGITAL (35% Ancho) ================= */}
            <div className="w-1/3 bg-white h-full flex flex-col justify-between shadow-2xl border-l border-gray-200">
                {/* Cabecera del Ticket */}
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight">Detalle de Comanda</h2>
                    <span className="bg-gray-200 text-gray-700 px-2.5 py-1 rounded-full text-xs font-bold">
                        {carrito.reduce((s, i) => s + i.cantidad, 0)} Items
                    </span>
                </div>

                {/* Lista de productos agregados en tiempo real */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50/50">
                    {carrito.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
                            <span className="text-4xl">🛒</span>
                            <p className="text-sm font-medium">La comanda está vacía</p>
                        </div>
                    ) : (
                        carrito.map(item => (
                            <div key={item.producto.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                                <div className="flex-1 pr-2">
                                    <h4 className="font-bold text-gray-800 text-sm leading-tight">{item.producto.nombre}</h4>
                                    <span className="text-xs text-gray-500 font-semibold">
                                        ${item.producto.precio.toLocaleString('es-CL')} c/u
                                    </span>
                                </div>
                                
                                <div className="flex items-center space-x-2.5">
                                    <button 
                                        className="w-7 h-7 bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg flex items-center justify-center font-black text-sm active:scale-90 transition-colors"
                                        onClick={() => quitarDelCarrito(item.producto.id)}
                                    >
                                        -
                                    </button>
                                    <span className="font-extrabold text-sm text-gray-800 w-4 text-center">{item.cantidad}</span>
                                    <button 
                                        className="w-7 h-7 bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg flex items-center justify-center font-black text-sm active:scale-90 transition-colors"
                                        onClick={() => agregarAlCarrito(item.producto)}
                                    >
                                        +
                                    </button>
                                </div>
                                
                                <div className="text-right w-20 font-black text-sm text-gray-900 ml-2">
                                    ${(item.producto.precio * item.cantidad).toLocaleString('es-CL')}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Métodos de Pago y Panel de Cálculos Financieros */}
                <div className="p-4 border-t border-gray-200 bg-white space-y-4">
                    <div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Método de Pago</span>
                        <div className="grid grid-cols-3 gap-2">
                            {(['efectivo', 'debito', 'credito'] as const).map(metodo => (
                                <button
                                    key={metodo}
                                    className={`py-2 px-1 text-xs font-bold rounded-lg uppercase tracking-tight border transition-all ${
                                        metodoPago === metodo 
                                            ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                                    onClick={() => {
                                        setMetodoPago(metodo);
                                        if (metodo !== 'efectivo') setMontoEntregado('');
                                    }}
                                >
                                    {metodo}
                                </button>
                            ))}
                        </div>
                    </div>

                    {metodoPago === 'efectivo' && (
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-2">
                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">Monto Entregado por Cliente</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                                <input 
                                    type="number" 
                                    className="w-full bg-white border border-gray-200 rounded-lg pl-7 pr-3 py-1.5 font-bold text-gray-800 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    placeholder="0"
                                    value={montoEntregado}
                                    onChange={(e) => setMontoEntregado(e.target.value === '' ? '' : Number(e.target.value))}
                                />
                            </div>
                            
                            {Number(montoEntregado) > 0 && (
                                <div className="flex justify-between items-center text-xs font-bold pt-1">
                                    <span className="text-gray-500">Vuelto a entregar:</span>
                                    <span className={`text-sm ${vuelto >= 0 ? 'text-green-600 font-black' : 'text-red-500'}`}>
                                        {vuelto >= 0 ? `$${vuelto.toLocaleString('es-CL')}` : 'Monto insuficiente'}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex justify-between items-center py-2 border-t border-b border-gray-100">
                        <span className="text-base font-black text-gray-800">TOTAL A COBRAR</span>
                        <span className="text-2xl font-black text-blue-600">${total.toLocaleString('es-CL')}</span>
                    </div>

                    <button 
                        className={`w-full py-4 rounded-xl text-white font-black text-base transition-all shadow-lg shadow-green-100 active:scale-95 uppercase tracking-wide ${
                            carrito.length === 0
                                ? 'bg-gray-300 shadow-none cursor-not-allowed'
                                : 'bg-green-500 hover:bg-green-600 shadow-green-200'
                        }`}
                        disabled={carrito.length === 0}
                        onClick={procesarVenta}
                    >
                        Cobrar y Enviar a Cocina
                    </button>
                </div>
            </div>
        </div>
    );
}