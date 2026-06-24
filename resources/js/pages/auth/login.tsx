import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Iniciar Sesión - SoftFood" />

            {/* --- SECCIÓN DE BRANDING OFICIAL SOFTFOOD --- */}
            <div className="flex flex-col items-center mb-8 mt-[-1rem]">
                <div className="w-full flex justify-center mb-4">
                    {/* Llamamos directamente a tu logo */}
                    <img 
                        src="/images/logo-softfood.png" 
                        alt="Logo Sistema SoftFood" 
                        className="h-36 w-auto object-contain drop-shadow-md" 
                    />
                </div>
                
                <h2 className="text-lg font-bold text-gray-500 tracking-tight text-center uppercase">
                    Control de Acceso
                </h2>
            </div>
            {/* -------------------------------------------------------- */}

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-slate-800 font-bold">Correo Electrónico</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="admin@softfood.com"
                                    className="focus-visible:ring-cyan-600 border-gray-300"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password" className="text-slate-800 font-bold">Contraseña</Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="ml-auto text-sm text-cyan-600 hover:text-cyan-700 font-bold transition-colors"
                                            tabIndex={5}
                                        >
                                            ¿Olvidaste tu contraseña?
                                        </TextLink>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Tu contraseña"
                                    className="focus-visible:ring-cyan-600 border-gray-300"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
                                />
                                <Label htmlFor="remember" className="text-slate-700">Mantener sesión iniciada</Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full bg-slate-900 hover:bg-cyan-700 text-white font-black text-base py-6 transition-all shadow-lg"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Ingresar al Sistema
                            </Button>
                        </div>

                        <div className="text-center text-sm text-slate-500 mt-2">
                            ¿Necesitas soporte?{' '}
                            <a 
                                href="https://www.instagram.com/laroatlb_developers/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-orange-500 font-black hover:text-orange-600 transition-colors text-sm"
                            >
                                Contactar Administrador
                            </a>
                        </div>
                    </>
                )}
            </Form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'SoftFood - Iniciar Sesión',
    description: 'Ingresa tus credenciales para acceder al sistema de gestión',
};