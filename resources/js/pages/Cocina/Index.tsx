import React, { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';

interface Producto {
    id: number;
    nombre: string;
}

interface Detalle {
    id: number;
    cantidad: number;
    producto: Producto;
}

interface Pedido {
    id: number;
    created_at: string;
    detalles: Detalle[];
}

interface Props {
    pedidos: Pedido[];
}

export default function CocinaIndex({ pedidos }: Props) {
    const [ahora, setAhora] = useState(new Date());
    
    useEffect(() => {
        const cronometro = setInterval(() => {
            setAhora(new Date());
        }, 1000);

        const intervaloReload = setInterval(() => {
            router.reload({ only: ['pedidos'] });
        }, 10000);

        return () => {
            clearInterval(cronometro);
            clearInterval(intervaloReload);
        };
    }, []);

    const marcarComoListo = (id: number) => {
        router.put(`/pedidos/${id}/listo`, {}, {
            preserveScroll: true,
        });
    };

    const formatoHora = (fechaString: string) => {
        const fecha = new Date(fechaString);
        return fecha.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
    };

    // VERSIÓN CORREGIDA: Ahora solo calcula el tiempo y devuelve el "nivel" de alerta
    const obtenerEstadoVisual = (fechaString: string) => {
        const fechaCreacion = new Date(fechaString);
        const diferenciaMs = ahora.getTime() - fechaCreacion.getTime();
        
        const totalSegundos = Math.floor(diferenciaMs / 1000);
        const minutos = Math.floor(totalSegundos / 60);
        const segundos = totalSegundos % 60;

        const formatoSegundos = segundos.toString().padStart(2, '0');
        const textoTiempo = `${minutos}:${formatoSegundos}`;

        let nivel = 'normal'; // 0 a 4:59 minutos
        if (minutos >= 6) {
            nivel = 'critico'; // 6+ minutos
        } else if (minutos >= 4) {
            nivel = 'advertencia'; // 4 a 5:59 minutos
        }

        return { textoTiempo, nivel };
    };

    return (
        <div className="min-h-screen bg-gray-200 p-4 md:p-8 font-sans">
            <Head title="Cocina - SoftFood" />

            <header className="mb-8 flex flex-col md:flex-row justify-between items-center border-b-2 border-gray-400 pb-4">
                <div className="text-center md:text-left mb-4 md:mb-0">
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 uppercase">Módulo de Cocina</h1>
                    <p className="text-gray-700 font-bold text-lg">Tablero de Pedidos Activos</p>
                </div>
                <div className="bg-white px-6 py-3 rounded-xl border-2 border-gray-300 shadow-md flex items-center">
                    <span className="text-gray-700 font-black uppercase text-lg tracking-wider mr-4">En espera:</span>
                    <span className="text-4xl font-black text-red-600">{pedidos.length}</span>
                </div>
            </header>

            {pedidos.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 text-gray-500 space-y-6">
                    <span className="text-7xl">🍽️</span>
                    <h2 className="text-3xl font-black text-gray-600">Sin pedidos pendientes</h2>
                    <p className="text-xl font-bold">¡La cocina está al día!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {pedidos.map(pedido => {
                        const { textoTiempo, nivel } = obtenerEstadoVisual(pedido.created_at);

                        return (
                            <div key={pedido.id} className={`bg-white rounded-xl shadow-xl flex flex-col border-2 overflow-hidden transform transition hover:scale-[1.02] ${
                                nivel === 'normal' ? 'border-gray-300' :
                                nivel === 'advertencia' ? 'border-orange-500' :
                                'border-red-600 shadow-red-200/50'
                            }`}>
                                
                                {/* CABECERA CON CLASES DIRECTAS PARA TAILWIND */}
                                <div className={`p-3 flex justify-between items-center border-b-2 ${
                                    nivel === 'normal' ? 'bg-yellow-400 border-yellow-500 text-gray-900' :
                                    nivel === 'advertencia' ? 'bg-orange-500 border-orange-600 text-white' :
                                    'bg-red-600 border-red-700 text-white animate-pulse'
                                }`}>
                                    <h2 className="text-2xl font-black uppercase">#{pedido.id}</h2>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-lg font-black tracking-wider">⏱️ {textoTiempo}</span>
                                    </div>
                                </div>

                                {/* LISTA DE PRODUCTOS */}
                                <div className={`p-4 flex-1 ${
                                    nivel === 'normal' ? 'bg-yellow-50/80' :
                                    nivel === 'advertencia' ? 'bg-orange-50' :
                                    'bg-red-50'
                                }`}>
                                    <div className="mb-3">
                                        <span className={`px-2 py-0.5 rounded text-xs font-black border uppercase tracking-wider ${
                                            nivel === 'normal' ? 'bg-white text-gray-900 border-yellow-600' :
                                            nivel === 'advertencia' ? 'bg-orange-700 text-white border-orange-800' :
                                            'bg-red-800 text-white border-red-900'
                                        }`}>
                                            Ingresó: {formatoHora(pedido.created_at)}
                                        </span>
                                    </div>

                                    <ul className="space-y-4">
                                        {pedido.detalles.map(detalle => (
                                            <li key={detalle.id} className="flex items-start border-b-2 border-gray-200/60 border-dotted pb-3 last:border-0 last:pb-0">
                                                <div className="text-3xl font-black text-red-600 w-12 flex-shrink-0">
                                                    {detalle.cantidad}x
                                                </div>
                                                <div className="font-bold text-gray-800 text-lg uppercase leading-tight pt-1">
                                                    {detalle.producto.nombre}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-3 bg-gray-100 border-t-2 border-gray-300">
                                    <button
                                        onClick={() => marcarComoListo(pedido.id)}
                                        className="w-full bg-green-500 hover:bg-green-600 text-white font-black text-2xl py-3 rounded-lg uppercase tracking-widest transition-colors shadow-md active:scale-95"
                                    >
                                        ¡Listo! ✅
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}