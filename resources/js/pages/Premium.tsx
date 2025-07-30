import Footer from '@/components/footer';
import Header from '@/components/header';
import Pagination from '@/components/pagination';
import PremiumHero from '@/components/premium-hero';
import PremiumWallpaperCard from '@/components/premium-wallpaper-card';
import SearchBar from '@/components/search-bar';
import ViewModeToggle from '@/components/view-mode-toggle';
import WallpaperModal from '@/components/wallpaper-modal';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
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

interface User {
    id: number;
    name: string;
    email: string;
    is_premium: boolean;
    premium_expires_at?: string;
}

interface PremiumPageProps {
    wallpapers: {
        data: Wallpaper[];
        links: any[];
        meta: any;
    };
    categories: Category[];
    user?: User;
}

export default function Premium() {
    const { auth, wallpapers, categories, user } = usePage<SharedData & PremiumPageProps>().props;
    const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');

    const isPremiumUser = user?.is_premium || false;

    // Filtrar wallpapers
    const filteredWallpapers = wallpapers.data.filter((wallpaper) => {
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
            <Head title="Premium - Vision4K">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <Header currentPage="premium" user={user} />
                <PremiumHero user={user} />

                {/* Filtros y Búsqueda */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder="Buscar en colección premium..." />

                    {/* Controles */}
                    <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        <h2 className="mb-4 text-2xl font-bold text-white lg:mb-0">
                            Colección Premium {!isPremiumUser && <span className="text-yellow-400">🔒</span>}
                        </h2>
                        <div className="flex items-center space-x-4">
                            <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
                        </div>
                    </div>

                    {/* Grid de Wallpapers Premium */}
                    <div className="mb-6 flex items-center justify-between">
                        <span className="text-gray-300">{filteredWallpapers.length} wallpapers premium</span>
                        <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 animate-pulse rounded-full bg-yellow-500"></div>
                            <span className="text-sm text-yellow-400">Exclusivo</span>
                        </div>
                    </div>

                    <div
                        className={`${viewMode === 'grid' ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'columns-1 gap-6 space-y-6 sm:columns-2 md:columns-3 lg:columns-4'}`}
                    >
                        {filteredWallpapers.map((wallpaper) => (
                            <PremiumWallpaperCard
                                key={wallpaper.id}
                                wallpaper={wallpaper}
                                viewMode={viewMode}
                                isPremiumUser={isPremiumUser}
                                onClick={handleWallpaperClick}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    <Pagination links={wallpapers.links} />
                </div>

                <Footer />
            </div>

            {/* Modal - Only for premium users */}
            {isPremiumUser && <WallpaperModal wallpaper={selectedWallpaper} onClose={handleModalClose} />}
        </>
    );
}
