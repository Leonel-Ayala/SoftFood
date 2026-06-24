import React from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';

// Cambiamos 'name' por 'nombre' y 'role' por 'rol' en la interfaz
interface Usuario {
    id: number;
    nombre: string;
    email: string;
    rol: string;
    created_at: string;
}

interface Props {
    usuarios: Usuario[];
}

export default function PersonalAdmin({ usuarios }: Props) {
    const { data, setData, post, processing, reset, errors } = useForm({
        nombre: '', // Cambiado aquí
        email: '',
        password: '',
        rol: '',    // Cambiado aquí
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/personal', {
            onSuccess: () => reset('password', 'email', 'nombre', 'rol'),
        });
    };

    const eliminarUsuario = (id: number) => {
        if (confirm('¿Estás seguro de que deseas quitar a este empleado del sistema? Perderá acceso inmediato.')) {
            router.delete(`/admin/personal/${id}`, {
                preserveScroll: true,
            });
        }
    };

    const badgeRol = (rol: string) => {
        switch (rol) {
            case 'admin':
                return <span className="bg-purple-100 text-purple-700 border border-purple-200 px-3 py-1 rounded-full text-xs font-black uppercase">Administrador</span>;
            case 'cajero':
                return <span className="bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-xs font-black uppercase">Cajero / POS</span>;
            case 'cocinero':
                return <span className="bg-orange-100 text-orange-700 border border-orange-200 px-3 py-1 rounded-full text-xs font-black uppercase">Cocina / KDS</span>;
            default:
                return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold uppercase">{rol || 'Sin Rol'}</span>;
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 p-6 md:p-10 font-sans">
            <Head title="Gestión de Personal - SoftFood" />

            <header className="mb-8">
                <Link href="/dashboard" className="text-cyan-600 font-bold hover:underline mb-2 inline-block">
                    ← Volver al Panel
                </Link>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Personal del Restaurante</h1>
                <p className="text-slate-600 text-lg font-medium">Gestiona los accesos, roles y cuentas de los empleados</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-8">
                        <h2 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
                            <span>👥</span> Registrar Empleado
                        </h2>
                        
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1 uppercase tracking-wider">Nombre Completo</label>
                                <input 
                                    type="text" 
                                    value={data.nombre}
                                    onChange={e => setData('nombre', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    placeholder="Ej: Juan Pérez"
                                />
                                {errors.nombre && <p className="text-red-500 text-xs font-bold mt-1">{errors.nombre}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1 uppercase tracking-wider">Correo Electrónico (Usuario)</label>
                                <input 
                                    type="email" 
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    placeholder="ejemplo@softfood.com"
                                />
                                {errors.email && <p className="text-red-500 text-xs font-bold mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1 uppercase tracking-wider">Contraseña de Acceso</label>
                                <input 
                                    type="password" 
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    placeholder="Mínimo 6 caracteres"
                                />
                                {errors.password && <p className="text-red-500 text-xs font-bold mt-1">{errors.password}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1 uppercase tracking-wider">Rol en el Local</label>
                                <select 
                                    value={data.rol}
                                    onChange={e => setData('rol', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                >
                                    <option value="">Selecciona un rol corporativo...</option>
                                    <option value="admin">Administrador (Acceso Total)</option>
                                    <option value="cajero">Cajero (Solo Módulo Caja)</option>
                                    <option value="cocinero">Cocinero (Solo Tablero Cocina)</option>
                                </select>
                                {errors.rol && <p className="text-red-500 text-xs font-bold mt-1">{errors.rol}</p>}
                            </div>

                            <button 
                                type="submit" 
                                disabled={processing}
                                className="w-full bg-slate-900 hover:bg-cyan-700 text-white font-black text-base py-3 rounded-xl uppercase tracking-widest transition-all shadow-md mt-2 disabled:opacity-50"
                            >
                                {processing ? 'Registrando...' : 'Registrar Empleado'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                            <h2 className="text-xl font-black text-slate-800">Lista del Equipo</h2>
                            <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">
                                {usuarios.length} trabajadores asignados
                            </span>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider">
                                        <th className="p-4 font-bold border-b border-slate-200">Nombre</th>
                                        <th className="p-4 font-bold border-b border-slate-200">Usuario / Correo</th>
                                        <th className="p-4 font-bold border-b border-slate-200">Rol asignado</th>
                                        <th className="p-4 font-bold border-b border-slate-200 text-center">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {usuarios.map(usuario => (
                                        <tr key={usuario.id} className="hover:bg-slate-50 transition-colors">
                                            {/* Aquí leemos usuario.nombre y usuario.rol */}
                                            <td className="p-4 font-bold text-slate-800">{usuario.nombre || 'Sin nombre'}</td>
                                            <td className="p-4 text-sm text-slate-500 font-medium">{usuario.email}</td>
                                            <td className="p-4">{badgeRol(usuario.rol)}</td>
                                            <td className="p-4 text-center">
                                                <button 
                                                    onClick={() => eliminarUsuario(usuario.id)}
                                                    className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border border-red-100"
                                                >
                                                    🗑️ Quitar
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