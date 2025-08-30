import FloatingCategoryMenu from '@/components/floating-category-menu';
import Footer from '@/components/footer';
import Header from '@/components/header';
import Hero from '@/components/hero';
import SearchBar from '@/components/search-bar';
import ViewModeToggle from '@/components/view-mode-toggle';
import WallpaperGrid from '@/components/wallpaper-grid';
import WallpaperModal from '@/components/wallpaper-modal';
import { Head } from '@inertiajs/react';
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
    is_favorited?: boolean;
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
    auth?: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
}

export default function Welcome({ wallpapers, categories, auth }: WelcomeProps) {
    // const { auth } = usePage<SharedData>().props;
    const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('masonry');
    const [] = useState<'newest' | 'popular' | 'name'>('newest');
    // const [isLoading, setIsLoading] = useState(false);

    // Filtrar wallpapers basado en categoría y búsqueda
    const filteredWallpapers = wallpapers.filter((wallpaper) => {
        const matchesCategory = selectedCategory === 'all' || wallpaper.category.toLowerCase().includes(selectedCategory.toLowerCase());
        const matchesSearch =
            wallpaper.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            wallpaper.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const handleWallpaperClick = async (wallpaper: Wallpaper) => {
        setSelectedWallpaper(wallpaper);

        // Incrementar vistas automáticamente cuando se abre el modal
        try {
            await fetch(`/wallpapers/${wallpaper.id}/view`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            console.error('Error incrementando vistas:', error);
        }
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
                        </div>
                    </div>
                </div>

                {/* Grid de wallpapers */}
                <WallpaperGrid wallpapers={filteredWallpapers} viewMode={viewMode} onWallpaperClick={handleWallpaperClick} auth={auth} />

                <Footer />
            </div>

            {/* Modal para vista ampliada */}
            <WallpaperModal wallpaper={selectedWallpaper} onClose={handleModalClose} />
        </>
    );
}
