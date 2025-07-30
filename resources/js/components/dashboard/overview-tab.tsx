import { Image, Upload } from 'lucide-react';
import StatsCard from './stats-card';

interface Stats {
    total_wallpapers: number;
    total_downloads: number;
    total_categories: number;
    recent_uploads: number;
}

interface OverviewTabProps {
    stats: Stats;
}

export default function OverviewTab({ stats }: OverviewTabProps) {
    return (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Wallpapers"
                    value={stats.total_wallpapers}
                    subtitle="+12 este mes"
                    icon={<Image className="h-6 w-6 text-purple-400" />}
                    iconBgColor="bg-purple-600/20"
                />

                <StatsCard
                    title="Total Descargas"
                    value={stats.total_downloads.toLocaleString()}
                    subtitle="+2.1k esta semana"
                    icon={<Upload className="h-6 w-6 text-green-400" />}
                    iconBgColor="bg-green-600/20"
                />

                <StatsCard
                    title="Categorías"
                    value={stats.total_categories}
                    subtitle="Todas activas"
                    icon={
                        <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                            />
                        </svg>
                    }
                    iconBgColor="bg-blue-600/20"
                />

                <StatsCard
                    title="Subidas Recientes"
                    value={stats.recent_uploads}
                    subtitle="Últimos 7 días"
                    icon={
                        <svg className="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>
                    }
                    iconBgColor="bg-yellow-600/20"
                />
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
                <h3 className="mb-4 text-lg font-semibold text-white">Acciones Rápidas</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <button className="flex items-center space-x-3 rounded-lg border border-purple-600/30 bg-purple-600/20 p-4 text-left text-purple-400 transition-colors hover:bg-purple-600/30">
                        <Upload size={20} />
                        <span>Subir Wallpaper</span>
                    </button>
                    <button className="flex items-center space-x-3 rounded-lg border border-green-600/30 bg-green-600/20 p-4 text-left text-green-400 transition-colors hover:bg-green-600/30">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Nueva Categoría</span>
                    </button>
                    <button className="flex items-center space-x-3 rounded-lg border border-blue-600/30 bg-blue-600/20 p-4 text-left text-blue-400 transition-colors hover:bg-blue-600/30">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                        </svg>
                        <span>Ver Estadísticas</span>
                    </button>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
                <h3 className="mb-4 text-lg font-semibold text-white">Actividad Reciente</h3>
                <div className="space-y-4">
                    {[
                        { action: 'Nuevo wallpaper subido', item: 'Aurora Boreal 4K', time: 'Hace 2 horas' },
                        { action: 'Categoría creada', item: 'Minimalista', time: 'Hace 1 día' },
                        { action: 'Wallpaper destacado', item: 'Waves Abstract', time: 'Hace 2 días' },
                        { action: 'Usuario premium', item: 'Juan Pérez se suscribió', time: 'Hace 3 días' },
                    ].map((activity, index) => (
                        <div key={index} className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                            <div>
                                <p className="text-sm text-white">{activity.action}</p>
                                <p className="text-xs text-gray-400">{activity.item}</p>
                            </div>
                            <span className="text-xs text-gray-500">{activity.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
