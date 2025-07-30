import { useEffect, useState } from 'react';

// Reutilizamos la definición de Wallpaper
interface Wallpaper {
    id: number;
    url: string;
    description: string;
    category?: string;
    tags?: string[];
}

// Definimos las props del modal
interface WallpaperModalProps {
    wallpaper: Wallpaper | null;
    onClose: () => void;
}

export default function WallpaperModal({ wallpaper, onClose }: WallpaperModalProps) {
    const [isDownloading, setIsDownloading] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        if (wallpaper) {
            setImageLoaded(false);
            // Preload image
            const img = new Image();
            img.onload = () => setImageLoaded(true);
            img.src = wallpaper.url;
        }
    }, [wallpaper]);

    // Close modal on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (wallpaper) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [wallpaper, onClose]);

    const handleDownload = async () => {
        if (!wallpaper) return;

        setIsDownloading(true);

        try {
            // Crear un enlace temporal para descargar
            const link = document.createElement('a');
            link.href = `/wallpapers/${wallpaper.id}/download`;
            link.download = `${wallpaper.description}.jpg`;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Mostrar mensaje de éxito
            setTimeout(() => {
                setIsDownloading(false);
            }, 2000);
        } catch (error) {
            console.error('Error al descargar:', error);
            setIsDownloading(false);
        }
    };

    const handleShare = async () => {
        if (!wallpaper) return;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: wallpaper.description,
                    text: `Mira este increíble wallpaper: ${wallpaper.description}`,
                    url: wallpaper.url,
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(wallpaper.url);
            // You could show a toast notification here
        }
    };

    if (!wallpaper) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm duration-300 animate-in fade-in"
            onClick={onClose}
        >
            <div
                className="relative mx-4 max-h-[95vh] max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-black shadow-2xl duration-500 animate-in zoom-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="absolute top-0 right-0 left-0 z-20 bg-gradient-to-b from-black/70 to-transparent p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="h-3 w-3 rounded-full bg-red-500"></div>
                            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        </div>

                        <div className="flex items-center space-x-2">
                            {/* Action Buttons */}
                            <button
                                onClick={handleShare}
                                className="group rounded-full bg-white/10 p-3 backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
                                title="Compartir"
                            >
                                <svg
                                    className="h-5 w-5 text-white transition-transform group-hover:scale-110"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                                    />
                                </svg>
                            </button>

                            <button
                                onClick={handleDownload}
                                disabled={isDownloading}
                                className="group rounded-full bg-gradient-to-r from-purple-600 to-pink-600 p-3 transition-all duration-300 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50"
                                title="Descargar"
                            >
                                {isDownloading ? (
                                    <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                ) : (
                                    <svg
                                        className="h-5 w-5 text-white transition-transform group-hover:scale-110"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                        />
                                    </svg>
                                )}
                            </button>

                            <button
                                onClick={onClose}
                                className="group rounded-full bg-red-500/20 p-3 backdrop-blur-sm transition-all duration-300 hover:bg-red-500/30"
                                title="Cerrar"
                            >
                                <svg
                                    className="h-5 w-5 text-white transition-transform group-hover:scale-110"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Image Container */}
                <div className="relative">
                    {!imageLoaded && (
                        <div className="absolute inset-0 flex min-h-[400px] items-center justify-center bg-gray-800">
                            <div className="flex flex-col items-center space-y-4">
                                <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500/30 border-t-purple-500"></div>
                                <p className="text-gray-400">Cargando imagen...</p>
                            </div>
                        </div>
                    )}

                    <img
                        src={wallpaper.url}
                        alt={wallpaper.description}
                        className={`max-h-[70vh] w-full object-contain transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setImageLoaded(true)}
                    />
                </div>

                {/* Footer Info */}
                <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6">
                    <div className="text-center">
                        <h3 className="mb-2 text-2xl font-bold text-white">{wallpaper.description}</h3>

                        {wallpaper.tags && wallpaper.tags.length > 0 && (
                            <div className="mb-4 flex flex-wrap justify-center gap-2">
                                {wallpaper.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="rounded-full border border-white/10 bg-gradient-to-r from-purple-500/30 to-pink-500/30 px-3 py-1 text-sm text-white backdrop-blur-sm"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center justify-center space-x-6 text-sm text-gray-300">
                            <div className="flex items-center space-x-1">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                </svg>
                                <span>Ultra HD 4K</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                                <span>Premium Quality</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-1/4 left-4 h-2 w-2 animate-pulse rounded-full bg-purple-400/30"></div>
                <div className="absolute top-1/3 right-6 h-1 w-1 animate-bounce rounded-full bg-pink-400/40"></div>
                <div className="absolute bottom-1/4 left-8 h-3 w-3 animate-ping rounded-full bg-blue-400/20"></div>
            </div>
        </div>
    );
}
