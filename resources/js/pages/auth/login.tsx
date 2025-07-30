import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Iniciar Sesión - Vision4K">
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
                    {/* Logo y Header */}
                    <div className="mb-8 text-center">
                        <Link href={route('welcome')} className="mb-6 inline-flex items-center space-x-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-600">
                                <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <div className="text-2xl font-black text-white">Vision4K</div>
                                <div className="-mt-1 text-xs text-gray-400">Ultra HD Wallpapers</div>
                            </div>
                        </Link>
                        <h1 className="mb-2 text-3xl font-bold text-white">¡Bienvenido de vuelta!</h1>
                        <p className="text-gray-400">Inicia sesión para acceder a tu cuenta</p>
                    </div>

                    {/* Form Container */}
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-8 shadow-2xl backdrop-blur-md">
                        {status && (
                            <div className="mb-6 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-400">{status}</div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="font-medium text-white">
                                    Correo electrónico
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    autoFocus
                                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 transition-all focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                                    placeholder="tu@email.com"
                                />
                                <InputError message={errors.email} className="text-red-400" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="font-medium text-white">
                                    Contraseña
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                        className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 pr-12 text-white placeholder-gray-400 transition-all focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 transition-colors hover:text-white"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <InputError message={errors.password} className="text-red-400" />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="remember"
                                        checked={data.remember}
                                        onCheckedChange={(checked) => setData('remember', checked as boolean)}
                                        className="border-white/20 data-[state=checked]:border-purple-600 data-[state=checked]:bg-purple-600"
                                    />
                                    <Label htmlFor="remember" className="cursor-pointer text-sm text-gray-300">
                                        Recordarme
                                    </Label>
                                </div>
                                {canResetPassword && (
                                    <TextLink href={route('password.request')} className="text-sm text-purple-400 hover:text-purple-300">
                                        ¿Olvidaste tu contraseña?
                                    </TextLink>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-semibold text-white transition-all duration-300 hover:from-purple-700 hover:to-pink-700 hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50"
                            >
                                {processing ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <LoaderCircle className="animate-spin" size={20} />
                                        <span>Iniciando sesión...</span>
                                    </div>
                                ) : (
                                    'Iniciar Sesión'
                                )}
                            </Button>
                        </form>

                        {/* Social Login Options */}
                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/20"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="bg-black/20 px-4 text-gray-400">O continúa con</span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <button className="flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-4 py-3 transition-colors hover:bg-white/10">
                                    <svg className="mr-2 h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    <span className="text-sm text-white">Google</span>
                                </button>
                                <button className="flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-4 py-3 transition-colors hover:bg-white/10">
                                    <svg className="mr-2 h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    <span className="text-sm text-white">Facebook</span>
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-400">
                                ¿No tienes una cuenta?{' '}
                                <TextLink href={route('register')} className="font-medium text-purple-400 hover:text-purple-300">
                                    Regístrate aquí
                                </TextLink>
                            </p>
                        </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-10 left-10 h-2 w-2 animate-pulse rounded-full bg-purple-400/30"></div>
                    <div className="absolute right-10 bottom-10 h-3 w-3 animate-bounce rounded-full bg-pink-400/20"></div>
                    <div className="absolute top-1/2 right-4 h-1 w-1 animate-ping rounded-full bg-blue-400/40"></div>
                </div>
            </div>
        </>
    );
}
