import { router } from '@inertiajs/react';

interface Wallpaper {
    id: number;
    url: string;
    description: string;
    category: string;
    tags: string[];
    downloads_count?: number;
    is_premium?: boolean;
    is_favorited?: boolean;
}

interface WallpaperGridProps {
    wallpapers: Wallpaper[];
    viewMode: 'grid' | 'masonry';
    onWallpaperClick: (wallpaper: Wallpaper) => void;
    auth?: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
}

export default function WallpaperGrid({ wallpapers, viewMode, onWallpaperClick, auth }: WallpaperGridProps) {
    // Función para manejar favoritos
    const handleToggleFavorite = (wallpaperId: number, e: React.MouseEvent) => {
        e.stopPropagation(); // Evitar que se abra el modal

        if (!auth?.user) {
            // Si no está autenticado, redirigir al login
            window.location.href = '/register';
            return;
        }

        router.post(
            `/wallpapers/${wallpaperId}/favorite`,
            {},
            {
                onSuccess: () => {
                    // Actualizar el estado local - esto se manejará en el componente padre
                    window.location.reload(); // Temporal, hasta que se implemente el estado global
                },
                onError: (errors) => {
                    console.error('Error al actualizar favorito:', errors);
                },
            },
        );
    };

    return (
        <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
            <div className="mb-6 flex flex-col justify-between sm:flex-row sm:items-center">
                <div className="flex items-center space-x-4 text-gray-300">
                    <span className="text-sm">{wallpapers.length} wallpapers encontrados</span>
                </div>
            </div>

            {/* Grid adaptativo basado en el modo de vista */}
            <div
                className={` ${
                    viewMode === 'grid'
                        ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                        : 'columns-1 gap-6 space-y-6 sm:columns-2 md:columns-3 lg:columns-4'
                } `}
            >
                {wallpapers.map((wallpaper, index) => (
                    <div
                        key={wallpaper.id}
                        className={`group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 ${
                            viewMode === 'masonry' ? 'mb-6 break-inside-avoid' : ''
                        }`}
                        style={{
                            animationDelay: `${index * 100}ms`,
                            animationFillMode: 'both',
                        }}
                        onClick={() => onWallpaperClick(wallpaper)}
                    >
                        <div className={`${viewMode === 'grid' ? 'aspect-video' : 'aspect-auto'} overflow-hidden`}>
                            <img
                                src={wallpaper.url}
                                alt={wallpaper.description}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                loading="lazy"
                            />
                        </div>

                        {/* Overlay con gradiente mejorado */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100" />

                        {/* Contenido mejorado con animaciones */}
                        <div className="absolute right-0 bottom-0 left-0 translate-y-full transform p-4 text-white transition-all duration-500 group-hover:translate-y-0">
                            <h3 className="mb-2 line-clamp-1 text-sm font-semibold">{wallpaper.description}</h3>
                            <div className="mb-2 flex flex-wrap gap-1">
                                {wallpaper.tags.slice(0, 3).map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded-full border border-white/20 bg-gradient-to-r from-purple-500/40 to-pink-500/40 px-2 py-1 text-xs backdrop-blur-sm"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            {/* Información adicional */}
                            <div className="flex items-center justify-between text-xs text-gray-300">
                                <span className="flex items-center space-x-1">
                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                    <span>4K Ultra HD</span>
                                </span>
                                <span className="capitalize">{wallpaper.category}</span>
                            </div>
                        </div>

                        {/* Botones de acción mejorados */}
                        <div className="absolute top-2 right-2 flex translate-y-2 transform space-x-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                            <button
                                className={`group/btn rounded-full p-2 backdrop-blur-sm transition-all duration-300 ${
                                    wallpaper.is_favorited ? 'bg-yellow-600/80 hover:bg-yellow-600' : 'bg-white/20 hover:bg-white/30'
                                }`}
                                title={wallpaper.is_favorited ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                                onClick={(e) => handleToggleFavorite(wallpaper.id, e)}
                            >
                                <svg
                                    className={`h-4 w-4 transition-transform group-hover/btn:scale-110 ${
                                        wallpaper.is_favorited ? 'text-white' : 'text-white/80'
                                    }`}
                                    fill={wallpaper.is_favorited ? 'currentColor' : 'none'}
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                            </button>
                            <button
                                className="group/btn rounded-full bg-gradient-to-r from-purple-600/80 to-pink-600/80 p-2 backdrop-blur-sm transition-all duration-300 hover:from-purple-600 hover:to-pink-600"
                                title="Descargar"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // Crear enlace de descarga
                                    const link = document.createElement('a');
                                    link.href = `/wallpapers/${wallpaper.id}/download`;
                                    link.target = '_blank';
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                }}
                            >
                                <svg
                                    className="h-4 w-4 text-white transition-transform group-hover/btn:scale-110"
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
                            </button>
                        </div>

                        {/* Indicador de calidad */}
                        <div className="absolute top-2 left-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <span className="rounded-full border border-white/20 bg-gradient-to-r from-green-600/80 to-blue-600/80 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                                HD
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mensaje cuando no hay resultados */}
            {wallpapers.length === 0 && (
                <div className="py-12 text-center">
                    <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-white/10">
                        <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-white">No se encontraron wallpapers</h3>
                    <p className="text-gray-400">Prueba con otros términos de búsqueda o categorías</p>
                </div>
            )}
        </div>
    );
}
