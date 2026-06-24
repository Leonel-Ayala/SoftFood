import React, { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

interface Usuario {
    id: number;
    nombre: string;
}

interface Cierre {
    id: number;
    monto_apertura: number;
    monto_sistema_efectivo: number;
    monto_sistema_debito: number;
    monto_real_efectivo: number;
    monto_real_debito: number;
    diferencia: number;
    observaciones: string | null;
    created_at: string;
    usuario?: Usuario;
}

interface Props {
    cierres: Cierre[];
    valoresSistema: {
        efectivo: number;
        debito: number;
        total: number;
    };
}

export default function CierreCajaAdmin({ cierres, valoresSistema }: Props) {
    
    const { data, setData, post, processing, reset, errors } = useForm({
        monto_apertura: '100000', // Monto base típico de sencillo inicial
        monto_sistema_efectivo: valoresSistema.efectivo.toString(),
        monto_sistema_debito: valoresSistema.debito.toString(),
        monto_real_efectivo: '',
        monto_real_debito: '',
        observaciones: '',
    });

    // Auto-rellenar si cambian los valores del sistema en vivo
    useEffect(() => {
        setData(d => ({
            ...d,
            monto_sistema_efectivo: valoresSistema.efectivo.toString(),
            monto_sistema_debito: valoresSistema.debito.toString(),
        }));
    }, [valoresSistema]);

    // Cálculos matemáticos en tiempo real para la vista
    const totalSistema = Number(data.monto_sistema_efectivo) + Number(data.monto_sistema_debito);
    const totalReal = Number(data.monto_real_efectivo) + Number(data.monto_real_debito);
    const calculoDiferencia = totalReal - totalSistema;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (confirm('¿Estás seguro de efectuar el cierre de caja? Esto asentará los valores del turno actual.')) {
            post('/admin/caja', {
                onSuccess: () => reset('monto_real_efectivo', 'monto_real_debito', 'observaciones'),
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 p-6 md:p-10 font-sans">
            <Head title="Cierres de Caja - SoftFood" />

            <header className="mb-8">
                <Link href="/dashboard" className="text-cyan-600 font-bold hover:underline mb-2 inline-block">
                    ← Volver al Panel
                </Link>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Cierres y Cuadres de Caja</h1>
                <p className="text-slate-600 text-lg font-medium">Efectúa el arqueo de caja del turno o revisa el histórico</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* FORMULARIO DE ENTRADA (ARQUEO EN VIVO) */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h2 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
                            <span>💰</span> Realizar Arqueo Actual
                        </h2>

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-black text-slate-500 mb-1 uppercase tracking-wider">Monto Apertura (Sencillo Inicial)</label>
                                <input 
                                    type="number" 
                                    value={data.monto_apertura}
                                    onChange={e => setData('monto_apertura', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </div>

                            {/* SECCIÓN DEL EFECTIVO */}
                            <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-3">
                                <span className="text-xs font-black text-emerald-800 uppercase tracking-widest block">💵 Flujo de Efectivo</span>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-0.5">Esperado en Sistema: <span className="font-black">${valoresSistema.efectivo.toLocaleString('es-CL')}</span></label>
                                    <input 
                                        type="number" 
                                        placeholder="Digita el efectivo real contado"
                                        value={data.monto_real_efectivo}
                                        onChange={e => setData('monto_real_efectivo', e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* SECCIÓN DE TARJETAS */}
                            <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 space-y-3">
                                <span className="text-xs font-black text-blue-800 uppercase tracking-widest block">💳 Flujo Electrónico (Débito/Crédito)</span>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-0.5">Esperado en Sistema: <span className="font-black">${valoresSistema.debito.toLocaleString('es-CL')}</span></label>
                                    <input 
                                        type="number" 
                                        placeholder="Digita el total de los vouchers"
                                        value={data.monto_real_debito}
                                        onChange={e => setData('monto_real_debito', e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* PANTALLA DE DIFERENCIA EN TIEMPO REAL */}
                            {data.monto_real_efectivo && data.monto_real_debito && (
                                <div className={`p-4 rounded-xl text-center border transition-colors ${
                                    calculoDiferencia === 0 
                                    ? 'bg-green-100 border-green-200 text-green-800' 
                                    : calculoDiferencia > 0 
                                    ? 'bg-blue-100 border-blue-200 text-blue-800'
                                    : 'bg-red-100 border-red-200 text-red-800'
                                }`}>
                                    <span className="text-xs font-black uppercase tracking-wider block">Resultado del Cuadre</span>
                                    <p className="text-2xl font-black">
                                        {calculoDiferencia === 0 ? '✓ Caja Cuadrada' : `$${calculoDiferencia.toLocaleString('es-CL')}`}
                                    </p>
                                    <span className="text-xs font-bold">
                                        {calculoDiferencia > 0 ? '(Sobrante de dinero)' : calculoDiferencia < 0 ? '(Faltante en caja)' : ''}
                                    </span>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-black text-slate-500 mb-1 uppercase tracking-wider">Novedades u Observaciones</label>
                                <textarea 
                                    rows={2}
                                    value={data.observaciones}
                                    onChange={e => setData('observaciones', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    placeholder="Ej: Se retiraron $50.000 para sencillo extra..."
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={processing}
                                className="w-full bg-slate-900 hover:bg-cyan-700 text-white font-black text-base py-3 rounded-xl uppercase tracking-widest transition-all shadow-md disabled:opacity-50"
                            >
                                {processing ? 'Consolidando...' : 'Efectuar Cierre Oficial'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* HISTORIAL DE CIERRES ANTERIORES */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-slate-50">
                            <h2 className="text-xl font-black text-slate-800">Historial de Auditoría</h2>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider border-b border-slate-200">
                                        <th className="p-4 font-black">Fecha / Hora</th>
                                        <th className="p-4 font-black">Responsable</th>
                                        <th className="p-4 font-black text-right">Esperado</th>
                                        <th className="p-4 font-black text-right">Contado</th>
                                        <th className="p-4 font-black">Observaciones</th>
                                        <th className="p-4 font-black text-center">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {cierres.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="p-12 text-center text-slate-400 font-bold text-sm">
                                                No hay registros de cierres archivados en el sistema.
                                            </td>
                                        </tr>
                                    ) : (
                                        cierres.map((cierre) => {
                                            const totalSis = closureTotalSistema(cierre);
                                            const totalRe = cierre.monto_real_efectivo + cierre.monto_real_debito;
                                            return (
                                                <tr key={cierre.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="p-4 text-sm font-bold text-slate-600">
                                                        {new Date(cierre.created_at).toLocaleString('es-CL', {dateStyle: 'short', timeStyle: 'short'})}
                                                    </td>
                                                    <td className="p-4 font-bold text-slate-800 uppercase text-xs">
                                                        👤 {cierre.usuario?.nombre || 'Admin'}
                                                    </td>
                                                    <td className="p-4 text-right text-sm font-semibold text-slate-500">
                                                        ${totalSis.toLocaleString('es-CL')}
                                                    </td>
                                                    <td className="p-4 text-right text-sm font-black text-slate-900">
                                                        ${totalRe.toLocaleString('es-CL')}
                                                    </td>
                                                    
                                                    <td className="p-4 text-xs text-slate-600 max-w-xs truncate" title={cierre.observaciones || ''}>
                                                        {cierre.observaciones ? (
                                                            <span className="italic">"{cierre.observaciones}"</span>
                                                        ) : (
                                                            <span className="text-slate-300 font-medium">Sin notas</span>
                                                        )}
                                                    </td>

                                                    <td className="p-4 text-center">
                                                        {cierre.diferencia === 0 ? (
                                                            <span className="bg-green-100 text-green-700 font-black text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider border border-green-200">Cuadrado</span>
                                                        ) : (
                                                            <span className={`font-black text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider border ${
                                                                cierre.diferencia > 0 
                                                                ? 'bg-blue-100 text-blue-700 border-blue-200' 
                                                                : 'bg-red-100 text-red-700 border-red-200'
                                                            }`}>
                                                                {cierre.diferencia > 0 ? `+ $${cierre.diferencia}` : `$${cierre.diferencia}`}
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })
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

function closureTotalSistema(cierre: Cierre) {
    return cierre.monto_sistema_efectivo + cierre.monto_sistema_debito;
}