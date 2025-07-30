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

interface PremiumWallpaperCardProps {
    wallpaper: Wallpaper;
    viewMode: 'grid' | 'masonry';
    isPremiumUser: boolean;
    onClick: (wallpaper: Wallpaper) => void;
}

export default function PremiumWallpaperCard({ wallpaper, viewMode, isPremiumUser, onClick }: PremiumWallpaperCardProps) {
    return (
        <div
            className={`group relative cursor-pointer overflow-hidden rounded-2xl border border-yellow-500/20 bg-white/5 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/25 ${
                viewMode === 'masonry' ? 'mb-6 break-inside-avoid' : ''
            }`}
            onClick={() => {
                if (isPremiumUser) {
                    onClick(wallpaper);
                }
            }}
        >
            {/* Premium Badge */}
            <div className="absolute top-2 left-2 z-10">
                <span className="flex items-center space-x-1 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 px-2 py-1 text-xs font-bold text-black">
                    <span>⭐</span>
                    <span>PREMIUM</span>
                </span>
            </div>

            <div className={`${viewMode === 'grid' ? 'aspect-video' : 'aspect-auto'} relative overflow-hidden`}>
                <img
                    src={wallpaper.thumbnail}
                    alt={wallpaper.title}
                    className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                        !isPremiumUser ? 'blur-sm' : ''
                    }`}
                    loading="lazy"
                />

                {/* Lock Overlay for non-premium users */}
                {!isPremiumUser && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="text-center">
                            <svg className="mx-auto mb-2 h-8 w-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                            <span className="text-xs text-yellow-400">Premium Required</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100" />

            {/* Content */}
            <div className="absolute right-0 bottom-0 left-0 translate-y-full transform p-4 text-white transition-all duration-500 group-hover:translate-y-0">
                <h3 className="mb-2 line-clamp-1 text-sm font-semibold">{wallpaper.title}</h3>

                {/* Stats */}
                <div className="mb-2 flex items-center space-x-4 text-xs text-gray-300">
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
                    <span className="rounded-full bg-green-500/20 px-2 py-1 text-green-400">8K</span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-300">
                    <span className="capitalize">{wallpaper.category}</span>
                    <span className="text-yellow-400">⭐ Exclusivo</span>
                </div>
            </div>
        </div>
    );
}
