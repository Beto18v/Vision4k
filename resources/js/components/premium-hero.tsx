import { Link } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    email: string;
    is_premium: boolean;
    premium_expires_at?: string;
}

interface PremiumHeroProps {
    user?: User;
}

export default function PremiumHero({ user }: PremiumHeroProps) {
    const isPremiumUser = user?.is_premium || false;

    return (
        <div className="relative py-24">
            <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                <h1 className="mb-6 text-4xl font-black text-white md:text-6xl">
                    ⭐ <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">Premium</span> Collection
                </h1>
                <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300">
                    Accede a nuestra colección exclusiva de wallpapers premium en resolución 8K. Contenido de la más alta calidad para usuarios
                    exigentes.
                </p>

                {!isPremiumUser && (
                    <div className="mx-auto max-w-md rounded-2xl border border-yellow-500/20 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 p-6 backdrop-blur-sm">
                        <h3 className="mb-3 text-xl font-bold text-yellow-400">¡Hazte Premium!</h3>
                        <p className="mb-4 text-sm text-gray-300">
                            Descargas ilimitadas, contenido exclusivo y acceso prioritario a nuevos lanzamientos.
                        </p>
                        <Link
                            href={route('dashboard')}
                            className="block w-full rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 px-6 py-3 text-center font-bold text-black transition-all hover:scale-105"
                        >
                            Upgrade a Premium - $9.99/mes
                        </Link>
                    </div>
                )}

                {/* Premium Benefits */}
                <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
                    <div className="text-center">
                        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-yellow-500/20 to-yellow-600/20">
                            <svg className="h-8 w-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                            </svg>
                        </div>
                        <div className="mb-1 text-lg font-bold text-white">Ilimitadas</div>
                        <div className="text-sm text-gray-400">Descargas</div>
                    </div>

                    <div className="text-center">
                        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500/20 to-purple-600/20">
                            <svg className="h-8 w-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                                />
                            </svg>
                        </div>
                        <div className="mb-1 text-lg font-bold text-white">Exclusivo</div>
                        <div className="text-sm text-gray-400">Contenido</div>
                    </div>

                    <div className="text-center">
                        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-green-500/20 to-green-600/20">
                            <svg className="h-8 w-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <div className="mb-1 text-lg font-bold text-white">8K</div>
                        <div className="text-sm text-gray-400">Resolución</div>
                    </div>

                    <div className="text-center">
                        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500/20 to-blue-600/20">
                            <svg className="h-8 w-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div className="mb-1 text-lg font-bold text-white">Priority</div>
                        <div className="text-sm text-gray-400">Acceso</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
