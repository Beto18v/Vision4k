import { Download, Eye, Heart, Star } from 'lucide-react';
import { useState } from 'react';

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
    onRefreshStats: () => void;
}

export default function FavoritesSection({ favorites, loading, onToggleFavorite, onRefreshStats }: FavoritesSectionProps) {
    const [removedItems, setRemovedItems] = useState<typeof favorites>([]);
    const [updatedWallpapers, setUpdatedWallpapers] = useState<typeof favorites>([]);

    const handleRemoveFavorite = (wallpaper: (typeof favorites)[0]) => {
        setRemovedItems((prev) => [...prev, wallpaper]);
        onToggleFavorite(wallpaper.id);
        setTimeout(() => {
            setRemovedItems((prev) => prev.filter((r) => r.id !== wallpaper.id));
        }, 300);
    };

    const handleDownload = async (wallpaper: (typeof favorites)[0]) => {
        try {
            // Optimistically update the download count
            setUpdatedWallpapers((prev) => {
                const existing = prev.find((w) => w.id === wallpaper.id);
                if (existing) {
                    return prev.map((w) => (w.id === wallpaper.id ? { ...w, downloads_count: w.downloads_count + 1 } : w));
                } else {
                    return [...prev, { ...wallpaper, downloads_count: wallpaper.downloads_count + 1 }];
                }
            });

            // Create download link and trigger download
            const link = document.createElement('a');
            link.href = `/wallpapers/${wallpaper.id}/download`;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Refresh stats after successful download
            setTimeout(() => {
                onRefreshStats();
            }, 1000); // Small delay to ensure download is processed on server
        } catch (error) {
            console.error('Error downloading:', error);
            // Revert optimistic update on error
            setUpdatedWallpapers((prev) => prev.filter((w) => w.id !== wallpaper.id));
        }
    };

    const allWallpapers = [...favorites, ...removedItems].filter((w, index, arr) => arr.findIndex((w2) => w2.id === w.id) === index);

    // Merge with updated wallpapers to show latest download counts
    const displayWallpapers = allWallpapers.map((wallpaper) => {
        const updated = updatedWallpapers.find((w) => w.id === wallpaper.id);
        return updated || wallpaper;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Mis Favoritos</h2>
                {loading && <div className="text-gray-400">Cargando...</div>}
            </div>

            {favorites.length === 0 && removedItems.length === 0 ? (
                <div className="rounded-xl border border-white/10 bg-black/20 p-8 text-center">
                    <Star className="mx-auto mb-4 text-gray-400" size={48} />
                    <h3 className="mb-2 text-xl font-semibold text-white">No tienes favoritos aún</h3>
                    <p className="text-gray-400">Explora los wallpapers y marca los que más te gusten como favoritos.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {displayWallpapers.map((wallpaper) => {
                        const isRemoving = removedItems.some((r) => r.id === wallpaper.id);
                        return (
                            <div
                                key={wallpaper.id}
                                className={`group relative overflow-hidden rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm transition-all duration-300 ${
                                    isRemoving ? 'scale-95 opacity-0' : ''
                                }`}
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
                                            <span
                                                className="flex cursor-pointer items-center space-x-1 hover:text-white"
                                                onClick={() => handleDownload(wallpaper)}
                                            >
                                                <Download size={20} />
                                                <span>{wallpaper.downloads_count}</span>
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveFavorite(wallpaper)}
                                            className="rounded-lg p-2 text-red-500 hover:bg-white/10"
                                        >
                                            <Heart size={20} fill="currentColor" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
