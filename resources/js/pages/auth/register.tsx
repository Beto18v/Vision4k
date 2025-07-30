import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, LoaderCircle, Lock, Mail, User } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Crear Cuenta - Vision4K">
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
                    {/* Logo and Back Link */}
                    <div className="mb-8 text-center">
                        <Link href={route('welcome')} className="mb-6 inline-flex items-center space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-600">
                                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <span className="text-2xl font-bold text-white">Vision4K</span>
                        </Link>
                        <h1 className="mb-2 text-3xl font-bold text-white">Crear Cuenta</h1>
                        <p className="text-gray-400">Únete a la mejor colección de wallpapers 4K</p>
                    </div>

                    {/* Register Card */}
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-8 shadow-2xl backdrop-blur-md">
                        <form onSubmit={submit} className="space-y-6">
                            {/* Name Field */}
                            <div>
                                <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-300">
                                    Nombre Completo
                                </label>
                                <div className="relative">
                                    <User className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400" size={20} />
                                    <input
                                        id="name"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        disabled={processing}
                                        className="w-full rounded-xl border border-white/20 bg-white/10 py-3 pr-4 pl-10 text-white placeholder-gray-400 transition-all focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/50 focus:outline-none disabled:opacity-50"
                                        placeholder="Ingresa tu nombre completo"
                                    />
                                </div>
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-300">
                                    Correo Electrónico
                                </label>
                                <div className="relative">
                                    <Mail className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400" size={20} />
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        tabIndex={2}
                                        autoComplete="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        disabled={processing}
                                        className="w-full rounded-xl border border-white/20 bg-white/10 py-3 pr-4 pl-10 text-white placeholder-gray-400 transition-all focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/50 focus:outline-none disabled:opacity-50"
                                        placeholder="ejemplo@correo.com"
                                    />
                                </div>
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-300">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <Lock className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400" size={20} />
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        tabIndex={3}
                                        autoComplete="new-password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        disabled={processing}
                                        className="w-full rounded-xl border border-white/20 bg-white/10 py-3 pr-12 pl-10 text-white placeholder-gray-400 transition-all focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/50 focus:outline-none disabled:opacity-50"
                                        placeholder="Crea una contraseña segura"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 transition-colors hover:text-white"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            {/* Password Confirmation Field */}
                            <div>
                                <label htmlFor="password_confirmation" className="mb-2 block text-sm font-medium text-gray-300">
                                    Confirmar Contraseña
                                </label>
                                <div className="relative">
                                    <Lock className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400" size={20} />
                                    <input
                                        id="password_confirmation"
                                        type={showPasswordConfirmation ? 'text' : 'password'}
                                        required
                                        tabIndex={4}
                                        autoComplete="new-password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        disabled={processing}
                                        className="w-full rounded-xl border border-white/20 bg-white/10 py-3 pr-12 pl-10 text-white placeholder-gray-400 transition-all focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/50 focus:outline-none disabled:opacity-50"
                                        placeholder="Confirma tu contraseña"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                        className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 transition-colors hover:text-white"
                                    >
                                        {showPasswordConfirmation ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <InputError message={errors.password_confirmation} className="mt-2" />
                            </div>

                            {/* Register Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-semibold text-white transition-all hover:from-purple-700 hover:to-pink-700 focus:ring-2 focus:ring-purple-500/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing && <LoaderCircle className="animate-spin" size={20} />}
                                <span>{processing ? 'Creando cuenta...' : 'Crear Cuenta'}</span>
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="my-6 flex items-center">
                            <div className="flex-1 border-t border-white/20"></div>
                            <span className="px-4 text-sm text-gray-400">o</span>
                            <div className="flex-1 border-t border-white/20"></div>
                        </div>

                        {/* Login Link */}
                        <div className="text-center">
                            <p className="text-gray-400">
                                ¿Ya tienes cuenta?{' '}
                                <Link href={route('login')} className="font-medium text-purple-400 transition-colors hover:text-purple-300">
                                    Iniciar Sesión
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center text-sm text-gray-500">
                        <p>Al crear una cuenta, aceptas nuestros términos y condiciones</p>
                    </div>
                </div>
            </div>
        </>
    );
}
