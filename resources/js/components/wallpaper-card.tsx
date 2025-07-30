interface Wallpaper {
    id: number;
    title: string;
    description: string;
    url: string;
    thumbnail: string;
    category: string;
    tags: string[];
    downloads_count: number;
    views_count: number;
    is_featured: boolean;
    is_premium: boolean;
    created_at: string;
    is_favorited: boolean;
}

interface WallpaperCardProps {
    wallpaper: Wallpaper;
    viewMode: 'grid' | 'masonry';
    onClick: (wallpaper: Wallpaper) => void;
}

export default function WallpaperCard({ wallpaper, viewMode, onClick }: WallpaperCardProps) {
    return (
        <div
            className={`group relative cursor-pointer overflow-hidden rounded-2xl bg-black/40 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 ${
                viewMode === 'masonry' ? 'mb-6 break-inside-avoid' : ''
            }`}
            onClick={() => onClick(wallpaper)}
        >
            {/* Premium Badge */}
            {wallpaper.is_premium && (
                <div className="absolute top-3 left-3 z-10">
                    <span className="flex items-center space-x-1 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 px-3 py-1 text-xs font-bold text-black shadow-lg">
                        <span>⭐</span>
                        <span>PREMIUM</span>
                    </span>
                </div>
            )}

            <div className={`${viewMode === 'grid' ? 'aspect-[4/3]' : 'aspect-auto'} relative overflow-hidden`}>
                <img
                    src={wallpaper.url || '/api/placeholder/400/300'}
                    alt={wallpaper.description}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                />

                {/* Gradient overlay permanente sutil */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Overlay que aparece en hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 transition-all duration-500 group-hover:opacity-100" />

            {/* Contenido que aparece en hover */}
            <div className="absolute right-0 bottom-0 left-0 translate-y-full transform p-4 text-white transition-all duration-500 group-hover:translate-y-0">
                <h3 className="mb-2 line-clamp-2 text-sm font-semibold">{wallpaper.description}</h3>

                {/* Stats y categoría */}
                <div className="mb-2 flex items-center space-x-4 text-xs text-gray-300">
                    {wallpaper.downloads_count && (
                        <span className="flex items-center space-x-1">
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                            </svg>
                            <span>{wallpaper.downloads_count}</span>
                        </span>
                    )}
                    <span className="rounded-full bg-purple-500/20 px-2 py-1 text-purple-300">4K</span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-300">
                    <span className="capitalize">{wallpaper.category}</span>
                    {wallpaper.is_premium && <span className="text-yellow-400">⭐ Premium</span>}
                </div>

                {/* Tags */}
                {wallpaper.tags && wallpaper.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                        {wallpaper.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="rounded-full bg-white/20 px-2 py-1 text-xs text-gray-300">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
