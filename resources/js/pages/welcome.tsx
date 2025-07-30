import FloatingCategoryMenu from '@/components/floating-category-menu';
import Footer from '@/components/footer';
import Header from '@/components/header';
import Hero from '@/components/hero';
import SearchBar from '@/components/search-bar';
import ViewModeToggle from '@/components/view-mode-toggle';
import WallpaperModal from '@/components/wallpaper-modal';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';

// Definimos la estructura de un Wallpaper
interface Wallpaper {
    id: number;
    url: string;
    description: string;
    category: string;
    tags: string[];
    downloads_count?: number;
    is_premium?: boolean;
}

// Definimos las categorías
interface Category {
    id: number;
    name: string;
    image: string;
    wallpaper_count?: number;
}

interface WelcomeProps {
    wallpapers: Wallpaper[];
    categories: Category[];
}

export default function Welcome({ wallpapers, categories }: WelcomeProps) {
    const { auth } = usePage<SharedData>().props;
    const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
    const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'name'>('newest');
    const [isLoading, setIsLoading] = useState(false);

    // Filtrar wallpapers basado en categoría y búsqueda
    const filteredWallpapers = wallpapers.filter((wallpaper) => {
        const matchesCategory = selectedCategory === 'all' || wallpaper.category.toLowerCase().includes(selectedCategory.toLowerCase());
        const matchesSearch =
            wallpaper.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            wallpaper.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const handleWallpaperClick = (wallpaper: Wallpaper) => {
        setSelectedWallpaper(wallpaper);
    };

    const handleModalClose = () => {
        setSelectedWallpaper(null);
    };

    return (
        <>
            <Head title="Vision4K - Wallpapers en 4K">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            {/* Header moderno con glassmorphism */}
            <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <Header currentPage="home" />

                {/* Floating Category Menu */}
                <FloatingCategoryMenu categories={categories} selectedCategory={selectedCategory} onCategorySelect={setSelectedCategory} />

                {/* Hero Section mejorado */}
                <div className="relative">
                    <Hero />

                    {/* Barra de búsqueda moderna con efectos avanzados */}
                    <div className="relative mx-auto mt-12 max-w-2xl px-4">
                        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Buscar wallpapers increíbles..." />
                    </div>

                    {/* Estadísticas en tiempo real */}
                    <div className="mx-auto mt-16 max-w-4xl px-4">
                        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                            <div className="group text-center">
                                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 transition-transform duration-300 group-hover:scale-110">
                                    <svg className="h-8 w-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <div className="mb-1 text-2xl font-bold text-white">{wallpapers.length}+</div>
                                <div className="text-sm text-gray-400">Wallpapers</div>
                            </div>

                            <div className="group text-center">
                                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600/20 to-cyan-600/20 transition-transform duration-300 group-hover:scale-110">
                                    <svg className="h-8 w-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                        />
                                    </svg>
                                </div>
                                <div className="mb-1 text-2xl font-bold text-white">{categories.length}</div>
                                <div className="text-sm text-gray-400">Categorías</div>
                            </div>

                            <div className="group text-center">
                                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-green-600/20 to-emerald-600/20 transition-transform duration-300 group-hover:scale-110">
                                    <svg className="h-8 w-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                        />
                                    </svg>
                                </div>
                                <div className="mb-1 text-2xl font-bold text-white">50K+</div>
                                <div className="text-sm text-gray-400">Descargas</div>
                            </div>

                            <div className="group text-center">
                                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-orange-600/20 to-red-600/20 transition-transform duration-300 group-hover:scale-110">
                                    <svg className="h-8 w-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                        />
                                    </svg>
                                </div>
                                <div className="mb-1 text-2xl font-bold text-white">4K</div>
                                <div className="text-sm text-gray-400">Ultra HD</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filtros de categorías mejorados */}
                <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <h2 className="mb-4 text-2xl font-bold text-white lg:mb-0">
                            {selectedCategory === 'all'
                                ? 'Explorar por categorías'
                                : `Categoría: ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}`}
                        </h2>

                        {/* Controles de vista y ordenamiento */}
                        <div className="flex items-center space-x-4">
                            <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />

                            {/* Selector de ordenamiento */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as 'newest' | 'popular' | 'name')}
                                className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-white backdrop-blur-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            >
                                <option value="newest" className="bg-gray-800">
                                    Más recientes
                                </option>
                                <option value="popular" className="bg-gray-800">
                                    Más populares
                                </option>
                                <option value="name" className="bg-gray-800">
                                    Por nombre
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Grid de wallpapers mejorado */}
                <div id="wallpapers-section" className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
                    <div className="mb-6 flex flex-col justify-between sm:flex-row sm:items-center">
                        <div className="flex items-center space-x-4 text-gray-300">
                            <span className="text-sm">{filteredWallpapers.length} wallpapers encontrados</span>
                            {isLoading && <div className="h-4 w-4 animate-spin rounded-full border-2 border-purple-500/30 border-t-purple-500"></div>}
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
                        {filteredWallpapers.map((wallpaper, index) => (
                            <div
                                key={wallpaper.id}
                                className={`group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 ${
                                    viewMode === 'masonry' ? 'mb-6 break-inside-avoid' : ''
                                }`}
                                style={{
                                    animationDelay: `${index * 100}ms`,
                                    animationFillMode: 'both',
                                }}
                                onClick={() => handleWallpaperClick(wallpaper)}
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
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
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
                                        className="group/btn rounded-full bg-black/40 p-2 backdrop-blur-sm transition-all duration-300 hover:bg-black/60"
                                        title="Vista previa"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleWallpaperClick(wallpaper);
                                        }}
                                    >
                                        <svg
                                            className="h-4 w-4 text-white transition-transform group-hover/btn:scale-110"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
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
                                        4K
                                    </span>
                                </div>

                                {/* Efectos de partículas flotantes */}
                                <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-0 transition-opacity duration-700 group-hover:opacity-100">
                                    <div
                                        className="absolute top-4 right-6 h-1 w-1 animate-ping rounded-full bg-white/30"
                                        style={{ animationDelay: '0ms' }}
                                    ></div>
                                    <div
                                        className="absolute top-8 right-4 h-2 w-2 animate-pulse rounded-full bg-purple-400/20"
                                        style={{ animationDelay: '200ms' }}
                                    ></div>
                                    <div
                                        className="absolute right-8 bottom-8 h-1 w-1 animate-bounce rounded-full bg-pink-400/30"
                                        style={{ animationDelay: '400ms' }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Mensaje cuando no hay resultados */}
                    {filteredWallpapers.length === 0 && (
                        <div className="py-12 text-center">
                            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-white/10">
                                <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-white">No se encontraron wallpapers</h3>
                            <p className="text-gray-400">Prueba con otros términos de búsqueda o categorías</p>
                        </div>
                    )}
                </div>

                <Footer />
            </div>

            {/* Modal para vista ampliada */}
            <WallpaperModal wallpaper={selectedWallpaper} onClose={handleModalClose} />
        </>
    );
}
