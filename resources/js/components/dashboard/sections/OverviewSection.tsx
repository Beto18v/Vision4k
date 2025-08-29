import { Eye, FolderOpen, Plus, Upload } from 'lucide-react';

interface OverviewSectionProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
        role: string;
        is_admin: boolean;
    };
    categories?: Array<{
        id: number;
        name: string;
        slug: string;
        wallpaper_count: number;
        total_downloads: number;
        image_url: string;
    }>;
    stats?: {
        total_wallpapers: number;
        total_downloads: number;
        total_categories: number;
        recent_uploads: number;
        total_views: number;
        featured_wallpapers: number;
        weekly_downloads?: number;
    };
    analytics?: {
        downloads_by_category: Array<{
            name: string;
            downloads: number;
        }>;
        popular_wallpapers: Array<{
            title: string;
            downloads_count: number;
            file_path: string;
        }>;
        uploads_by_month: Array<{
            month: number;
            count: number;
        }>;
    };
    onCreateCategory: () => void;
}

export default function OverviewSection({ auth, categories = [], stats, analytics, onCreateCategory }: OverviewSectionProps) {
    // Usar datos reales o valores vacíos (no datos por defecto)
    const displayStats = stats || {
        total_wallpapers: 0,
        total_downloads: 0,
        total_categories: 0,
        recent_uploads: 0,
        total_views: 0,
        featured_wallpapers: 0,
    };

    const displayCategories = categories || [];

    return (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm transition-colors hover:bg-white/5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400">Total Wallpapers</p>
                            <p className="text-2xl font-bold text-white">{displayStats.total_wallpapers}</p>
                            <p className="mt-1 text-xs text-green-400">+{displayStats.recent_uploads} hoy</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600/20">
                            <FolderOpen className="h-6 w-6 text-purple-400" />
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm transition-colors hover:bg-white/5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400">Total Descargas</p>
                            <p className="text-2xl font-bold text-white">{displayStats.total_downloads.toLocaleString()}</p>
                            <p className="mt-1 text-xs text-green-400">+{displayStats.weekly_downloads || 0} esta semana</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600/20">
                            <Upload className="h-6 w-6 text-green-400" />
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm transition-colors hover:bg-white/5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400">Total Vistas</p>
                            <p className="text-2xl font-bold text-white">{displayStats.total_views.toLocaleString()}</p>
                            <p className="mt-1 text-xs text-blue-400">Todas activas</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600/20">
                            <Eye className="h-6 w-6 text-blue-400" />
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm transition-colors hover:bg-white/5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400">Categorías</p>
                            <p className="text-2xl font-bold text-white">{displayStats.total_categories}</p>
                            <p className="mt-1 text-xs text-orange-400">Todas activas</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-600/20">
                            <FolderOpen className="h-6 w-6 text-orange-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories Overview */}
            <div className="rounded-xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">Categorías</h3>
                    <button onClick={onCreateCategory} className="text-sm text-purple-400 hover:text-purple-300">
                        <Plus size={16} className="mr-1 inline" />
                        Agregar
                    </button>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {displayCategories.slice(0, 20).map((category) => (
                        <div
                            key={category.id}
                            className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg">
                                    <FolderOpen className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-white">{category.name}</h4>
                                    <p className="text-sm text-gray-400">{category.wallpaper_count} wallpapers</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-white">{category.total_downloads}</p>
                                <p className="text-xs text-gray-400">descargas</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Analytics Section */}
            {analytics && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="rounded-xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
                        <h3 className="mb-4 text-lg font-semibold text-white">Descargas por Categoría</h3>
                        <div className="space-y-3">
                            {(() => {
                                // Usar las categorías disponibles con sus descargas totales
                                const categoriesWithDownloads = displayCategories.filter((cat) => cat.total_downloads > 0);
                                // Ordenar categorías por descargas totales de mayor a menor
                                const sortedCategories = [...categoriesWithDownloads].sort((a, b) => b.total_downloads - a.total_downloads);
                                // Calcular el total de descargas de todas las categorías
                                const totalDownloads = sortedCategories.reduce((sum, cat) => sum + cat.total_downloads, 0);

                                return sortedCategories.slice(0, 5).map((category, index) => {
                                    // Calcular porcentaje relativo al total (representación)
                                    const percentage = totalDownloads > 0 ? (category.total_downloads / totalDownloads) * 100 : 0;

                                    return (
                                        <div key={index} className="flex items-center justify-between">
                                            <span className="text-gray-300">{category.name}</span>
                                            <div className="flex items-center space-x-3">
                                                <span className="text-sm text-white">{percentage.toFixed(1)}%</span>
                                                <div className="h-2 w-24 rounded-full bg-white/10">
                                                    <div
                                                        className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm text-white">{category.total_downloads}</span>
                                            </div>
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
                        <h3 className="mb-4 text-lg font-semibold text-white">Wallpapers Más Populares</h3>
                        <div className="space-y-3">
                            {analytics.popular_wallpapers.slice(0, 5).map((wallpaper, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <div className="relative h-8 w-12 overflow-hidden rounded bg-gray-700">
                                        <img
                                            src={wallpaper.file_path}
                                            alt={wallpaper.title}
                                            className="h-full w-full object-cover transition-opacity duration-200"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                // Intentar con ruta relativa si la absoluta falla
                                                if (!target.src.includes('/storage/')) {
                                                    target.src = `/storage/${wallpaper.file_path}`;
                                                } else {
                                                    target.style.display = 'none';
                                                    const parent = target.parentElement;
                                                    if (parent) {
                                                        const placeholder = parent.querySelector('.image-placeholder') as HTMLElement;
                                                        if (placeholder) placeholder.style.display = 'flex';
                                                    }
                                                }
                                            }}
                                            onLoad={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'block';
                                                const parent = target.parentElement;
                                                if (parent) {
                                                    const placeholder = parent.querySelector('.image-placeholder') as HTMLElement;
                                                    if (placeholder) placeholder.style.display = 'none';
                                                }
                                            }}
                                        />
                                        <div className="image-placeholder absolute inset-0 hidden items-center justify-center bg-gray-600 text-gray-400">
                                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="truncate text-sm font-medium text-white">{wallpaper.title}</p>
                                        <p className="text-xs text-gray-400">{wallpaper.downloads_count} descargas</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
