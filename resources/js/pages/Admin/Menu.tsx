import React from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';

interface Categoria {
    id: number;
    nombre: string;
    activo: boolean;
}

interface Producto {
    id: number;
    nombre: string;
    precio: number;
    activo: boolean;
    categoria: Categoria;
}

interface Props {
    productos: Producto[];
    categorias: Categoria[];
}

export default function MenuAdmin({ productos, categorias }: Props) {
    
    // FORMULARIO 1: Para crear Productos
    const formProducto = useForm({
        nombre: '',
        precio: '',
        categoria_id: '',
    });

    // FORMULARIO 2: Para crear Categorías
    const formCategoria = useForm({
        nombre: '',
    });

    // Envío del formulario de productos
    const submitProducto = (e: React.FormEvent) => {
        e.preventDefault();
        formProducto.post('/admin/menu', {
            onSuccess: () => formProducto.reset(),
        });
    };

    // Envío del formulario de categorías
    const submitCategoria = (e: React.FormEvent) => {
        e.preventDefault();
        formCategoria.post('/admin/categorias', {
            onSuccess: () => formCategoria.reset(),
        });
    };

    const toggleActivo = (id: number) => {
        router.put(`/admin/menu/${id}/toggle`, {}, {
            preserveScroll: true,
        });
    };

    return (
        <div className="min-h-screen bg-slate-100 p-6 md:p-10 font-sans">
            <Head title="Gestión de Menú - SoftFood" />

            <header className="mb-8">
                <Link href="/dashboard" className="text-cyan-600 font-bold hover:underline mb-2 inline-block">
                    ← Volver al Panel
                </Link>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Menú y Productos</h1>
                <p className="text-slate-600 text-lg font-medium">Administra el catálogo y la disponibilidad</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* PANEL IZQUIERDO: FORMULARIOS DE CREACIÓN */}
                <div className="lg:col-span-1 space-y-6">
                    
                    {/* FORMULARIO DE CATEGORÍAS */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h2 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
                            <span>📁</span> Nueva Categoría
                        </h2>
                        <form onSubmit={submitCategoria} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1 uppercase tracking-wider">Nombre de Categoría</label>
                                <input 
                                    type="text" 
                                    value={formCategoria.data.nombre}
                                    onChange={e => formCategoria.setData('nombre', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    placeholder="Ej: Postres, Promos, Ensaladas"
                                />
                                {formCategoria.errors.nombre && <p className="text-red-500 text-xs font-bold mt-1">{formCategoria.errors.nombre}</p>}
                            </div>
                            <button 
                                type="submit" 
                                disabled={formCategoria.processing}
                                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-black text-sm py-2.5 rounded-xl uppercase tracking-widest transition-all shadow-md disabled:opacity-50"
                            >
                                {formCategoria.processing ? 'Guardando...' : 'Crear Categoría'}
                            </button>
                        </form>
                    </div>
                    {/*Modificar Categorias*/}

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mt-6">
                        <h2 className="text-lg font-black text-slate-800 mb-4">Categorías Existentes</h2>
                        <div className="space-y-2">
                            {categorias.map(cat => (
                                <div key={cat.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="font-bold text-slate-700">{cat.nombre}</span>
                                    <button 
                                        onClick={() => router.patch(`/admin/categorias/${cat.id}/toggle`)}
                                        className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-colors border ${
                                            cat.activo 
                                                ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200' 
                                                : 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200'}`
                                        }
                                    >
                                        {cat.activo ? 'Visible' : 'Oculta'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>


                    {/* FORMULARIO DE PRODUCTOS */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h2 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
                            <span>🍔</span> Nuevo Producto
                        </h2>
                        <form onSubmit={submitProducto} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1 uppercase tracking-wider">Nombre del Producto</label>
                                <input 
                                    type="text" 
                                    value={formProducto.data.nombre}
                                    onChange={e => formProducto.setData('nombre', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    placeholder="Ej: Big Burger Doble"
                                />
                                {formProducto.errors.nombre && <p className="text-red-500 text-xs font-bold mt-1">{formProducto.errors.nombre}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1 uppercase tracking-wider">Precio ($)</label>
                                <input 
                                    type="number" 
                                    value={formProducto.data.precio}
                                    onChange={e => formProducto.setData('precio', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    placeholder="Ej: 6500"
                                />
                                {formProducto.errors.precio && <p className="text-red-500 text-xs font-bold mt-1">{formProducto.errors.precio}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1 uppercase tracking-wider">Categoría</label>
                                <select 
                                    value={formProducto.data.categoria_id}
                                    onChange={e => formProducto.setData('categoria_id', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                >
                                    <option value="">Selecciona una categoría...</option>
                                    {categorias.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                    ))}
                                </select>
                                {formProducto.errors.categoria_id && <p className="text-red-500 text-xs font-bold mt-1">{formProducto.errors.categoria_id}</p>}
                            </div>

                            <button 
                                type="submit" 
                                disabled={formProducto.processing}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-base py-3 rounded-xl uppercase tracking-widest transition-all shadow-md disabled:opacity-50"
                            >
                                {formProducto.processing ? 'Guardando...' : 'Guardar Producto'}
                            </button>
                        </form>
                    </div>

                </div>

                {/* PANEL DERECHO: TABLA DEL CATÁLOGO */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                            <h2 className="text-xl font-black text-slate-800">Catálogo Actual</h2>
                            <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">
                                {productos.length} items registrados
                            </span>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider">
                                        <th className="p-4 font-bold border-b border-slate-200 w-16">ID</th>
                                        <th className="p-4 font-bold border-b border-slate-200">Producto</th>
                                        <th className="p-4 font-bold border-b border-slate-200">Categoría</th>
                                        <th className="p-4 font-bold border-b border-slate-200">Precio</th>
                                        <th className="p-4 font-bold border-b border-slate-200 text-center">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {productos.map(producto => (
                                        <tr key={producto.id} className={`hover:bg-slate-50 transition-colors ${!producto.activo ? 'opacity-60 bg-gray-50' : ''}`}>
                                            <td className="p-4 font-black text-slate-400">#{producto.id}</td>
                                            <td className="p-4 font-bold text-slate-800 uppercase">{producto.nombre}</td>
                                            <td className="p-4 text-sm text-slate-500 font-medium">{producto.categoria?.nombre || 'Sin categoría'}</td>
                                            <td className="p-4 font-black text-slate-900">${producto.precio.toLocaleString('es-CL')}</td>
                                            <td className="p-4 text-center">
                                                <button 
                                                    onClick={() => toggleActivo(producto.id)}
                                                    className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-colors border ${
                                                        producto.activo 
                                                        ? 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200' 
                                                        : 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200'
                                                    }`}
                                                >
                                                    {producto.activo ? 'En Venta' : 'Agotado'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}