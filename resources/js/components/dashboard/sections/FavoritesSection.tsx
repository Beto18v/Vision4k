import { Download, Eye, Heart, Star } from 'lucide-react';

interface FavoritesSectionProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
        role: string;
        is_admin: boolean;
    };
    favorites: Array<{
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
    loading: boolean;
    onToggleFavorite: (wallpaperId: number) => void;
}

export default function FavoritesSection({ favorites, loading, onToggleFavorite }: FavoritesSectionProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Mis Favoritos</h2>
                {loading && <div className="text-gray-400">Cargando...</div>}
            </div>

            {favorites.length === 0 ? (
                <div className="rounded-xl border border-white/10 bg-black/20 p-8 text-center">
                    <Star className="mx-auto mb-4 text-gray-400" size={48} />
                    <h3 className="mb-2 text-xl font-semibold text-white">No tienes favoritos aún</h3>
                    <p className="text-gray-400">Explora los wallpapers y marca los que más te gusten como favoritos.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {favorites.map((wallpaper) => (
                        <div
                            key={wallpaper.id}
                            className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm"
                        >
                            <div className="aspect-video overflow-hidden">
                                <img
                                    src={wallpaper.file_path}
                                    alt={wallpaper.title}
                                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="mb-2 font-semibold text-white">{wallpaper.title}</h3>
                                <p className="mb-3 text-sm text-gray-200">{wallpaper.category}</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                                        <span className="flex items-center space-x-1">
                                            <Eye size={20} />
                                            <span>{wallpaper.views_count}</span>
                                        </span>
                                        <span className="flex items-center space-x-1">
                                            <Download size={20} />
                                            <span>{wallpaper.downloads_count}</span>
                                        </span>
                                    </div>
                                    <button onClick={() => onToggleFavorite(wallpaper.id)} className="rounded-lg p-2 text-red-400 hover:bg-white/10">
                                        <Heart size={20} fill="currentColor" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
