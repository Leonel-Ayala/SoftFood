import React from 'react';
import { Head, Link } from '@inertiajs/react';

interface Props {
    ventasHoy: number;
    pedidosHoy: number;
    productosActivos: number;
}

export default function Dashboard({ ventasHoy, pedidosHoy, productosActivos }: Props) {
    return (
        <div className="min-h-screen bg-slate-100 p-6 md:p-10 font-sans">
            <Head title="Admin Dashboard - SoftFood" />

            <header className="mb-10">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Panel de Administración</h1>
                <p className="text-slate-600 text-lg font-medium mt-1">Resumen general y accesos del sistema</p>
            </header>

            {/* TARJETAS DE MÉTRICAS (Estadísticas del Día) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-8 border-l-green-500">
                    <h3 className="text-slate-500 font-bold uppercase tracking-wider text-sm mb-2">Ventas de Hoy</h3>
                    <p className="text-4xl font-black text-slate-900">${ventasHoy.toLocaleString('es-CL')}</p>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-8 border-l-blue-500">
                    <h3 className="text-slate-500 font-bold uppercase tracking-wider text-sm mb-2">Pedidos Realizados</h3>
                    <p className="text-4xl font-black text-slate-900">{pedidosHoy}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-8 border-l-yellow-500">
                    <h3 className="text-slate-500 font-bold uppercase tracking-wider text-sm mb-2">Productos en Menú</h3>
                    <p className="text-4xl font-black text-slate-900">{productosActivos}</p>
                </div>
            </div>

            {/* ACCESOS DIRECTOS A SUB-MÓDULOS */}
            <div>
                <h2 className="text-2xl font-black text-slate-800 mb-6">Gestión del Restaurante</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    
                    <Link href="/admin/menu" className="bg-white hover:bg-slate-50 p-6 rounded-2xl shadow-sm border border-slate-200 text-left transition-all hover:-translate-y-1 hover:shadow-md group block">
                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">🍔</div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">Menú y Productos</h3>
                        <p className="text-slate-500 text-sm">Crear, editar precios o deshabilitar productos.</p>
                    </Link>

                    <Link href="/admin/personal" className="bg-white hover:bg-slate-50 p-6 rounded-2xl shadow-sm border border-slate-200 text-left transition-all hover:-translate-y-1 hover:shadow-md group block">
                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">👥</div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">Personal (Usuarios)</h3>
                        <p className="text-slate-500 text-sm">Gestionar cajeros, pines de acceso y roles.</p>
                    </Link>

                    <Link href="/admin/reportes" className="bg-white hover:bg-slate-50 p-6 rounded-2xl shadow-sm border border-slate-200 border-b-4 border-b-cyan-500 text-left transition-all hover:-translate-y-1 hover:shadow-md group block">
                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">📊</div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">Reporte de Ventas</h3>
                        <p className="text-cyan-600 font-bold text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> En Vivo
                        </p>
                        <p className="text-slate-500 text-sm">Monitor de ingresos y flujo de pedidos actual.</p>
                    </Link>

                    <Link href="/admin/caja" className="bg-white hover:bg-slate-50 p-6 rounded-2xl shadow-sm border border-slate-200 text-left transition-all hover:-translate-y-1 hover:shadow-md group block">
                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">💰</div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">Cierres de Turno</h3>
                        <p className="text-slate-500 text-sm">Revisar los cuadres y diferencias de caja.</p>
                    </Link>

                </div>
            </div>
        </div>
    );
}