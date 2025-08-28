import { Link } from '@inertiajs/react';

interface DashboardHeaderProps {
    userName: string;
}

export default function DashboardHeader({ userName }: DashboardHeaderProps) {
    return (
        <header className="sticky top-0 z-20 border-b border-white/10 bg-black/20 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center space-x-6">
                        <Link href={route('welcome')} className="flex items-center space-x-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600">
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
                            <span className="text-xl font-bold text-white">Vision4K</span>
                        </Link>
                        <span className="text-sm text-gray-400">Dashboard</span>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="hidden text-right md:block">
                            <div className="text-sm text-white">{userName}</div>
                            <div className="text-xs text-gray-400">Administrador</div>
                        </div>
                        <Link
                            href={route('logout')}
                            method="post"
                            className="rounded-lg border border-red-600/30 bg-red-600/20 px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-600/30"
                        >
                            Cerrar Sesión
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
