import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    email: string;
    is_premium?: boolean;
    premium_expires_at?: string;
}

interface HeaderProps {
    currentPage?: 'home' | 'trending' | 'premium';
    user?: User;
}

export default function Header({ currentPage = 'home', user }: HeaderProps) {
    const { auth } = usePage<SharedData>().props;
    const isPremiumUser = user?.is_premium || false;

    const isCurrentPage = (page: string) => currentPage === page;

    return (
        <>
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-20 h-72 w-72 animate-pulse rounded-full bg-purple-600/10 blur-3xl"></div>
                <div className="absolute right-20 bottom-40 h-96 w-96 animate-pulse rounded-full bg-pink-600/10 blur-3xl delay-1000"></div>
                <div className="absolute top-60 right-40 h-80 w-80 animate-pulse rounded-full bg-blue-600/10 blur-3xl delay-2000"></div>
            </div>

            <header className="sticky top-0 z-20 border-b border-white/10 bg-black/20 backdrop-blur-md">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 items-center justify-between">
                        <div className="flex items-center space-x-6">
                            {/* Logo */}
                            <Link href={route('welcome')} className="flex items-center space-x-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-600">
                                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                    <div className="-mt-1 hidden text-xs text-gray-300 md:block">Ultra HD Wallpapers</div>
                                </div>
                            </Link>

                            {/* Navigation */}
                            <nav className="hidden items-center space-x-8 lg:flex">
                                <Link
                                    href={route('welcome')}
                                    className={`group relative transition-colors duration-300 ${
                                        isCurrentPage('home') ? 'text-white' : 'text-gray-300 hover:text-white'
                                    }`}
                                >
                                    Inicio
                                    {isCurrentPage('home') ? (
                                        <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-gradient-to-r from-purple-500 to-pink-500"></span>
                                    ) : (
                                        <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
                                    )}
                                </Link>
                                <Link
                                    href={route('wallpapers.trending')}
                                    className={`group relative transition-colors duration-300 ${
                                        isCurrentPage('trending') ? 'text-white' : 'text-gray-300 hover:text-white'
                                    }`}
                                >
                                    Trending
                                    {isCurrentPage('trending') ? (
                                        <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-gradient-to-r from-purple-500 to-pink-500"></span>
                                    ) : (
                                        <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
                                    )}
                                </Link>
                                <Link
                                    href={route('wallpapers.premium')}
                                    className={`group relative transition-colors duration-300 ${
                                        isCurrentPage('premium') ? 'text-white' : 'text-gray-300 hover:text-white'
                                    }`}
                                >
                                    Premium
                                    {isCurrentPage('premium') ? (
                                        <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-gradient-to-r from-yellow-500 to-yellow-400"></span>
                                    ) : (
                                        <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
                                    )}
                                </Link>
                            </nav>
                        </div>

                        {/* User Actions */}
                        <div className="flex items-center space-x-4">
                            {auth.user ? (
                                <div className="flex items-center space-x-4">
                                    {isPremiumUser && (
                                        <span className="rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 px-3 py-1 text-xs font-bold text-black">
                                            ⭐ PREMIUM
                                        </span>
                                    )}
                                    <div className="hidden items-center space-x-2 text-gray-300 md:flex">
                                        <span className="text-sm">Hola,</span>
                                        <span className="font-medium text-white">{auth.user.name}</span>
                                    </div>
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-pink-700 hover:shadow-purple-500/25"
                                    >
                                        Dashboard
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-3">
                                    <Link
                                        href={route('login')}
                                        className="px-4 py-2 font-medium text-white transition-colors duration-300 hover:text-purple-300"
                                    >
                                        Iniciar Sesión
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-pink-700 hover:shadow-purple-500/25"
                                    >
                                        Registrarse
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
