import Footer from '@/components/footer';
import Header from '@/components/header';
import WallpaperModal from '@/components/wallpaper-modal';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

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

interface Category {
    id: number;
    name: string;
    image: string;
}

interface TrendingPageProps {
    wallpapers: {
        data: Wallpaper[];
        links: any[];
        meta: any;
    };
    categories: Category[];
}

export default function Trending() {
    const { auth, wallpapers, categories } = usePage<SharedData & TrendingPageProps>().props;
    const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
    const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'name'>('popular');

    // Filtrar wallpapers
    const filteredWallpapers = (wallpapers?.data || []).filter((wallpaper) => {
        const matchesCategory = selectedCategory === 'all' || wallpaper.category.toLowerCase().includes(selectedCategory);
        const matchesSearch =
            wallpaper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
            <Head title="Trending - Vision4K">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                {/* Animated background particles */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-20 h-72 w-72 animate-pulse rounded-full bg-purple-600/10 blur-3xl"></div>
                    <div className="absolute right-20 bottom-40 h-96 w-96 animate-pulse rounded-full bg-pink-600/10 blur-3xl delay-1000"></div>
                    <div className="absolute top-60 right-40 h-80 w-80 animate-pulse rounded-full bg-blue-600/10 blur-3xl delay-2000"></div>
                </div>

                <Header currentPage="trending" user={auth.user} />

                {/* Hero Section */}
                <div className="relative py-24">
                    <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                        <h1 className="mb-6 text-4xl font-black text-white md:text-6xl">
                            🔥 <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Trending</span> Wallpapers
                        </h1>
                        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300">
                            Los wallpapers más populares de la semana. Descubre lo que está en tendencia y únete a la comunidad.
                        </p>

                        {/* Estadísticas trending */}
                        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
                            <div className="text-center">
                                <div className="mb-2 text-3xl font-bold text-orange-400">{wallpapers?.meta?.total || 0}+</div>
                                <div className="text-sm text-gray-400">En Tendencia</div>
                            </div>
                            <div className="text-center">
                                <div className="mb-2 text-3xl font-bold text-red-400">50K+</div>
                                <div className="text-sm text-gray-400">Descargas Hoy</div>
                            </div>
                            <div className="text-center">
                                <div className="mb-2 text-3xl font-bold text-pink-400">15K+</div>
                                <div className="text-sm text-gray-400">Vistas</div>
                            </div>
                            <div className="text-center">
                                <div className="mb-2 text-3xl font-bold text-purple-400">4K</div>
                                <div className="text-sm text-gray-400">Ultra HD</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filtros y Búsqueda */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Barra de búsqueda */}
                    <div className="relative mx-auto mb-8 max-w-2xl">
                        <input
                            type="text"
                            placeholder="Buscar en trending..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-lg text-white placeholder-gray-300 backdrop-blur-md focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/50 focus:outline-none"
                        />
                        <svg
                            className="absolute top-1/2 right-6 h-6 w-6 -translate-y-1/2 text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    {/* Controles */}
                    <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <h2 className="mb-4 text-2xl font-bold text-white lg:mb-0">Wallpapers en Tendencia</h2>
                        <div className="flex items-center space-x-4">
                            {/* Vista Mode */}
                            <div className="flex items-center rounded-xl bg-white/10 p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`rounded-lg p-2 transition-all ${viewMode === 'grid' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-white/10'}`}
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                                        />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setViewMode('masonry')}
                                    className={`rounded-lg p-2 transition-all ${viewMode === 'masonry' ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-white/10'}`}
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                    </svg>
                                </button>
                            </div>

                            {/* Sort */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-white backdrop-blur-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                            >
                                <option value="popular" className="bg-gray-800">
                                    Más Populares
                                </option>
                                <option value="newest" className="bg-gray-800">
                                    Más Recientes
                                </option>
                                <option value="name" className="bg-gray-800">
                                    Por Nombre
                                </option>
                            </select>
                        </div>
                    </div>

                    {/* Grid de Wallpapers */}
                    <div className="mb-6 flex items-center justify-between">
                        <span className="text-gray-300">{filteredWallpapers.length} wallpapers trending</span>
                        <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 animate-pulse rounded-full bg-orange-500"></div>
                            <span className="text-sm text-orange-400">En vivo</span>
                        </div>
                    </div>

                    <div
                        className={`${viewMode === 'grid' ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'columns-1 gap-6 space-y-6 sm:columns-2 md:columns-3 lg:columns-4'}`}
                    >
                        {filteredWallpapers.map((wallpaper, index) => (
                            <div
                                key={wallpaper.id}
                                className={`group relative cursor-pointer overflow-hidden rounded-2xl border border-orange-500/20 bg-white/5 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25 ${viewMode === 'masonry' ? 'mb-6 break-inside-avoid' : ''}`}
                                onClick={() => handleWallpaperClick(wallpaper)}
                            >
                                {/* Trending Badge */}
                                <div className="absolute top-2 left-2 z-10">
                                    <span className="flex items-center space-x-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-2 py-1 text-xs font-bold text-white">
                                        <span>🔥</span>
                                        <span>#{index + 1}</span>
                                    </span>
                                </div>

                                <div className={`${viewMode === 'grid' ? 'aspect-video' : 'aspect-auto'} overflow-hidden`}>
                                    <img
                                        src={wallpaper.thumbnail}
                                        alt={wallpaper.title}
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                    />
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
                                        <span className="flex items-center space-x-1">
                                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                            </svg>
                                            <span>{wallpaper.views_count}</span>
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-gray-300">
                                        <span className="capitalize">{wallpaper.category}</span>
                                        {wallpaper.is_premium && (
                                            <span className="rounded-full bg-yellow-500/20 px-2 py-1 text-yellow-400">Premium</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {wallpapers.links && (
                        <div className="mt-12 flex justify-center">
                            <div className="flex space-x-2">
                                {wallpapers.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`rounded-lg px-4 py-2 transition-all ${
                                            link.active
                                                ? 'bg-orange-600 text-white'
                                                : link.url
                                                  ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                                                  : 'cursor-not-allowed bg-gray-600 text-gray-400'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <Footer />
            </div>

            {/* Modal */}
            <WallpaperModal wallpaper={selectedWallpaper} onClose={handleModalClose} />
        </>
    );
}
