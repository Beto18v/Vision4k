import { Filter, Search } from 'lucide-react';
import { useState } from 'react';

interface WallpapersSectionProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
        role: string;
        is_admin: boolean;
    };
    wallpapers?: Array<{
        id: number;
        title: string;
        description: string;
        file_path: string;
        category: string;
        downloads_count: number;
        views_count: number;
        created_at: string;
        is_featured: boolean;
        is_active: boolean;
        is_premium: boolean;
        is_favorited: boolean;
        user?: {
            name: string;
        };
    }>;
    onDeleteWallpaper: (wallpaperId: number) => void;
    onToggleFavorite?: (wallpaperId: number) => void;
}

export default function WallpapersSection({ auth, wallpapers = [], onDeleteWallpaper, onToggleFavorite }: WallpapersSectionProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const displayWallpapers = wallpapers || [];

    return (
        <div className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400" size={20} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-xl border border-white/20 bg-white/10 py-3 pr-4 pl-10 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                        placeholder="Buscar wallpapers..."
                    />
                </div>
                <button className="flex items-center space-x-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-gray-300 transition-colors hover:text-white">
                    <Filter size={20} />
                    <span>Filtros</span>
                </button>
            </div>

            {/* Wallpapers Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {displayWallpapers
                    .filter(
                        (w) =>
                            w.title.toLowerCase().includes(searchTerm.toLowerCase()) || w.category.toLowerCase().includes(searchTerm.toLowerCase()),
                    )
                    .map((wallpaper) => (
                        <div
                            key={wallpaper.id}
                            className="overflow-hidden rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm transition-all hover:border-purple-500/30"
                        >
                            <div className="relative">
                                <img src={wallpaper.file_path} alt={wallpaper.title} className="h-48 w-full object-cover" />
                                <div className="absolute top-2 right-2 flex space-x-1">
                                    {auth.is_admin && (
                                        <button
                                            onClick={() => onDeleteWallpaper(wallpaper.id)}
                                            className="rounded-lg bg-red-600/80 p-2 text-white backdrop-blur-sm transition-colors hover:bg-red-600"
                                            title="Eliminar wallpaper"
                                        >
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="p-4">
                                <h4 className="mb-2 truncate font-medium text-white">{wallpaper.title}</h4>
                                <p className="mb-3 text-sm text-gray-400">{wallpaper.category}</p>
                                <div className="mb-3 flex items-center justify-between text-xs text-gray-500">
                                    <span>{wallpaper.downloads_count} descargas</span>
                                    <span>{wallpaper.views_count} vistas</span>
                                </div>
                                <div className="text-xs text-gray-500">Subido: {new Date(wallpaper.created_at).toLocaleDateString()}</div>
                            </div>
                        </div>
                    ))}
            </div>

            {displayWallpapers.length === 0 && (
                <div className="rounded-xl border border-white/10 bg-black/20 p-8 text-center backdrop-blur-sm">
                    <p className="text-gray-400">No hay wallpapers disponibles</p>
                </div>
            )}
        </div>
    );
}
