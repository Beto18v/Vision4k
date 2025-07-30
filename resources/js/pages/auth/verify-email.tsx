import { Head, Link, useForm } from '@inertiajs/react';
import { CheckCircle, LoaderCircle, Mail, RefreshCw } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <>
            <Head title="Verificar Email - Vision4K">
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
                        <h1 className="mb-2 text-3xl font-bold text-white">Verificar Email</h1>
                        <p className="text-gray-400">Revisa tu correo electrónico para verificar tu cuenta</p>
                    </div>

                    {/* Status Message */}
                    {status === 'verification-link-sent' && (
                        <div className="mb-6 rounded-xl border border-green-600/30 bg-green-600/20 p-4 text-center">
                            <div className="mb-2 flex items-center justify-center space-x-3">
                                <CheckCircle className="h-5 w-5 text-green-400" />
                                <span className="font-medium text-green-400">¡Correo Enviado!</span>
                            </div>
                            <p className="text-sm text-green-300">
                                Se ha enviado un nuevo enlace de verificación a tu dirección de correo electrónico.
                            </p>
                        </div>
                    )}

                    {/* Verification Card */}
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-8 shadow-2xl backdrop-blur-md">
                        {/* Email Icon */}
                        <div className="mb-6 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20">
                                <Mail className="h-8 w-8 text-purple-400" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-white">Verifica tu correo electrónico</h3>
                            <p className="text-sm text-gray-400">
                                Hemos enviado un enlace de verificación a tu correo electrónico. Haz clic en el enlace para activar tu cuenta.
                            </p>
                        </div>

                        {/* Instructions */}
                        <div className="mb-6 space-y-4">
                            <div className="flex items-start space-x-3 rounded-lg bg-white/5 p-3">
                                <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-600/20">
                                    <span className="text-xs font-bold text-purple-400">1</span>
                                </div>
                                <p className="text-sm text-gray-300">Revisa tu bandeja de entrada y carpeta de spam</p>
                            </div>
                            <div className="flex items-start space-x-3 rounded-lg bg-white/5 p-3">
                                <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-600/20">
                                    <span className="text-xs font-bold text-purple-400">2</span>
                                </div>
                                <p className="text-sm text-gray-300">Haz clic en el enlace de verificación</p>
                            </div>
                            <div className="flex items-start space-x-3 rounded-lg bg-white/5 p-3">
                                <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-600/20">
                                    <span className="text-xs font-bold text-purple-400">3</span>
                                </div>
                                <p className="text-sm text-gray-300">¡Listo! Tu cuenta estará verificada</p>
                            </div>
                        </div>

                        {/* Resend Button */}
                        <form onSubmit={submit} className="space-y-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-semibold text-white transition-all hover:from-purple-700 hover:to-pink-700 focus:ring-2 focus:ring-purple-500/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? (
                                    <>
                                        <LoaderCircle className="animate-spin" size={20} />
                                        <span>Enviando...</span>
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw size={20} />
                                        <span>Reenviar Correo de Verificación</span>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="my-6 flex items-center">
                            <div className="flex-1 border-t border-white/20"></div>
                            <span className="px-4 text-sm text-gray-400">o</span>
                            <div className="flex-1 border-t border-white/20"></div>
                        </div>

                        {/* Logout Link */}
                        <div className="text-center">
                            <Link
                                href={route('logout')}
                                method="post"
                                className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
                            >
                                Cerrar Sesión
                            </Link>
                        </div>
                    </div>

                    {/* Support Info */}
                    <div className="mt-8 text-center text-sm text-gray-500">
                        <p>¿Problemas con la verificación? Contacta nuestro soporte</p>
                    </div>
                </div>
            </div>
        </>
    );
}
