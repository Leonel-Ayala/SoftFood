import React, { useEffect } from 'react';
import { Head, router, Link } from '@inertiajs/react';

interface Detalle {
    id: number;
    cantidad: number;
    producto: { nombre: string };
}

interface Pedido {
    id: number;
    total: number;
    metodo_pago: string;
    estado: string;
    created_at: string;
    detalles: Detalle[];
}

interface TopProducto {
    nombre: string;
    total_cantidad: string | number;
}

interface Props {
    stats: {
        total: number;
        cantidad: number;
        efectivo: number;
        debito: number;
    };
    topProductos: TopProducto[];
    ultimosPedidos: Pedido[];
}

export default function ReportesEnVivo({ stats, topProductos, ultimosPedidos }: Props) {
    
    // CONSULTA AUTOMÁTICA AL SERVIDOR CADA 8 SEGUNDOS (Silenciosa y fluida)
    useEffect(() => {
        const intervalo = setInterval(() => {
            router.reload({ 
                only: ['stats', 'topProductos', 'ultimosPedidos']
            });
        }, 8000);
        return () => clearInterval(intervalo);
    }, []);

    const formatoHora = (fecha: string) => {
        return new Date(fecha).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
    };

    // Calcular el valor máximo del ranking para escalar las barras gráficas proporcionalmente
    const maxVendido = topProductos.length > 0 ? Math.max(...topProductos.map(p => Number(p.total_cantidad))) : 1;

    return (
        <div className="min-h-screen bg-slate-100 p-6 md:p-10 font-sans">
            <Head title="Monitor de Ventas - SoftFood" />

            <header className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <Link href="/dashboard" className="text-cyan-600 font-bold hover:underline mb-1 inline-block">
                        ← Volver al Panel
                    </Link>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        Monitor de Ventas
                        <span className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-2 border border-red-200 font-extrabold">
                            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                            En Vivo
                        </span>
                    </h1>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm text-sm font-bold text-slate-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Canal de datos operativo
                </div>
            </header>

            {/* TARJETAS DE MÉTRICAS MONETARIAS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md border border-slate-800 relative overflow-hidden">
                    <h3 className="text-slate-400 font-bold uppercase tracking-wider text-xs mb-1">Ingresos de Hoy</h3>
                    <p className="text-4xl font-black">${stats.total.toLocaleString('es-CL')}</p>
                    <div className="absolute -right-4 -bottom-4 text-slate-800 opacity-20 text-8xl font-black">📈</div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-1">Pedidos Totales</h3>
                    <p className="text-4xl font-black text-slate-900">{stats.cantidad} comensales</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-8 border-l-emerald-500">
                    <h3 className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-1">Efectivo en Caja</h3>
                    <p className="text-4xl font-black text-slate-900">${stats.efectivo.toLocaleString('es-CL')}</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-8 border-l-blue-500">
                    <h3 className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-1">Ventas con Tarjeta</h3>
                    <p className="text-4xl font-black text-slate-900">${stats.debito.toLocaleString('es-CL')}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* RECUADRO IZQUIERDO: RANKING EN VIVO DE PRODUCTOS */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 h-full">
                        <div className="mb-6">
                            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                                <span>🔥</span> Los Más Vendidos
                            </h2>
                            <p className="text-slate-500 text-sm font-medium mt-0.5">Ranking de unidades el día de hoy</p>
                        </div>

                        <div className="space-y-5">
                            {topProductos.length === 0 ? (
                                <div className="text-center py-10 text-slate-400 font-bold text-sm border-2 border-dashed border-slate-200 rounded-xl">
                                    Esperando primera venta...
                                </div>
                            ) : (
                                topProductos.map((prod, index) => {
                                    // Calculamos el porcentaje de ancho de la barra
                                    const porcentaje = (Number(prod.total_cantidad) / maxVendido) * 100;
                                    
                                    return (
                                        <div key={index} className="space-y-1.5">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="font-bold text-slate-800 uppercase tracking-tight">
                                                    {index + 1}. {prod.nombre}
                                                </span>
                                                <span className="font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md text-xs">
                                                    {prod.total_cantidad} uds
                                                </span>
                                            </div>
                                            {/* Gráfico de barra nativo */}
                                            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                                <div 
                                                    className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                                                    style={{ width: `${porcentaje}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* RECUADRO DERECHO: FEED GENERAL DE TRANSACCIONES */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden h-full">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-black text-slate-800">Últimas Transacciones</h2>
                                <p className="text-slate-500 text-xs font-medium mt-0.5">Historial secuencial de boletas emitidas</p>
                            </div>
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest bg-white border border-slate-200 px-3 py-1 rounded-md shadow-sm animate-pulse">
                                Sync OK
                            </span>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/70 text-slate-500 uppercase text-xs tracking-wider border-b border-slate-200">
                                        <th className="p-4 font-black w-20">Hora</th>
                                        <th className="p-4 font-black w-24">Ticket</th>
                                        <th className="p-4 font-black">Ítems preparados</th>
                                        <th className="p-4 font-black w-28">Método</th>
                                        <th className="p-4 font-black text-right w-28">Monto</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {ultimosPedidos.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="p-12 text-center text-slate-400 font-bold text-sm">
                                                No se registran transacciones para la fecha actual.
                                            </td>
                                        </tr>
                                    ) : (
                                        ultimosPedidos.map((pedido) => (
                                            <tr key={pedido.id} className="hover:bg-slate-50/80 transition-colors">
                                                <td className="p-4 text-slate-500 font-bold text-sm">
                                                    {formatoHora(pedido.created_at)}
                                                </td>
                                                <td className="p-4">
                                                    <span className="bg-slate-900 text-white font-black px-2.5 py-1 rounded-lg text-xs tracking-wide">
                                                        #{pedido.id}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-sm text-slate-700 font-medium max-w-xs truncate">
                                                    {pedido.detalles.map(d => `${d.cantidad}x ${d.producto.nombre}`).join(', ')}
                                                </td>
                                                <td className="p-4">
                                                    <span className={`text-xs font-black uppercase px-2.5 py-1 rounded-md border ${
                                                        pedido.metodo_pago === 'efectivo' 
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                                        : 'bg-blue-50 text-blue-700 border-blue-200'
                                                    }`}>
                                                        💵 {pedido.metodo_pago}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right font-black text-slate-900">
                                                    ${pedido.total.toLocaleString('es-CL')}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}