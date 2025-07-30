import { Head, Link, useForm } from '@inertiajs/react';
import { AlertTriangle, LoaderCircle, Lock, Shield } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';

export default function ConfirmPassword() {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm<Required<{ password: string }>>({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Confirmar Contraseña - Vision4K">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
                {/* Animated background particles */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-20 h-72 w-72 animate-pulse rounded-full bg-purple-600/10 blur-3xl"></div>
                    <div className="absolute right-20 bottom-40 h-96 w-96 animate-pulse rounded-full bg-pink-600/10 blur-3xl delay-1000"></div>
                    <div className="absolute top-60 right-40 h-80 w-80 animate-pulse rounded-full bg-blue-600/10 blur-3xl delay-2000"></div>
                </div>

                <div className="relative z-10 w-full max-w-md">
                    {/* Logo and Title */}
                    <div className="mb-8 text-center">
                        <Link href={route('welcome')} className="mb-6 inline-flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-600">
                                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <span className="text-2xl font-bold text-white">Vision4K</span>
                        </Link>
                        <h1 className="mb-2 text-3xl font-bold text-white">Confirmar Contraseña</h1>
                        <p className="text-gray-400">Esta es un área segura. Confirma tu contraseña para continuar</p>
                    </div>

                    {/* Security Warning */}
                    <div className="mb-6 rounded-xl border border-yellow-600/30 bg-yellow-600/20 p-4">
                        <div className="flex items-start space-x-3">
                            <AlertTriangle className="mt-0.5 h-5 w-5 text-yellow-400" />
                            <div>
                                <h4 className="text-sm font-medium text-yellow-400">Área Segura</h4>
                                <p className="mt-1 text-xs text-yellow-300">
                                    Necesitas confirmar tu contraseña antes de acceder a esta sección protegida.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Confirmation Card */}
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-8 shadow-2xl backdrop-blur-md">
                        <div className="mb-6 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20">
                                <Shield className="h-8 w-8 text-purple-400" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-white">Verificación de Seguridad</h3>
                            <p className="text-sm text-gray-400">Ingresa tu contraseña para confirmar tu identidad</p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-300">
                                    Contraseña Actual
                                </label>
                                <div className="relative">
                                    <Lock className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400" size={20} />
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        autoComplete="current-password"
                                        value={data.password}
                                        autoFocus
                                        onChange={(e) => setData('password', e.target.value)}
                                        disabled={processing}
                                        className="w-full rounded-xl border border-white/20 bg-white/10 py-3 pr-4 pl-10 text-white placeholder-gray-400 transition-all focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/50 focus:outline-none disabled:opacity-50"
                                        placeholder="Ingresa tu contraseña"
                                    />
                                </div>
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            {/* Confirm Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-semibold text-white transition-all hover:from-purple-700 hover:to-pink-700 focus:ring-2 focus:ring-purple-500/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing && <LoaderCircle className="animate-spin" size={20} />}
                                <span>{processing ? 'Verificando...' : 'Confirmar Contraseña'}</span>
                            </button>
                        </form>

                        {/* Security Tips */}
                        <div className="mt-6 rounded-xl border border-blue-600/30 bg-blue-600/20 p-4">
                            <div className="flex items-start space-x-3">
                                <Shield className="mt-0.5 h-5 w-5 text-blue-400" />
                                <div>
                                    <h4 className="text-sm font-medium text-blue-400">Consejos de Seguridad</h4>
                                    <ul className="mt-1 space-y-1 text-xs text-blue-300">
                                        <li>• Nunca compartas tu contraseña con nadie</li>
                                        <li>• Usa contraseñas únicas para cada cuenta</li>
                                        <li>• Cierra sesión en dispositivos compartidos</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Back Link */}
                    <div className="mt-8 text-center">
                        <Link href={route('dashboard')} className="font-medium text-purple-400 transition-colors hover:text-purple-300">
                            ← Volver al Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
