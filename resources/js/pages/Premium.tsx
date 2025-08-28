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

interface PremiumPageProps {
    wallpapers: {
        data: Wallpaper[];
        links: { url: string; label: string; active: boolean }[];
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
    categories: Category[];
}

export default function Premium() {
    const { wallpapers } = usePage<SharedData & PremiumPageProps>().props;
    const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
    const [selectedCategory] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
    const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'name'>('newest');

    const filteredWallpapers = wallpapers.data.filter((wallpaper) => {
        const matchesSearch =
            searchTerm === '' ||
            wallpaper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            wallpaper.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            wallpaper.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = selectedCategory === 'all' || wallpaper.category.toLowerCase().includes(selectedCategory.toLowerCase());

        return matchesSearch && matchesCategory;
    });

    const sortedWallpapers = [...filteredWallpapers].sort((a, b) => {
        switch (sortBy) {
            case 'popular':
                return b.downloads_count + b.views_count - (a.downloads_count + a.views_count);
            case 'name':
                return a.title.localeCompare(b.title);
            case 'newest':
            default:
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
    });

    return (
        <>
            <Head title="Premium Wallpapers" />
            <Header />

            <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                {/* Hero Section */}
                <div className="relative overflow-hidden bg-gradient-to-r from-yellow-500/10 to-purple-500/10 py-20">
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                    ></div>
                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="mb-4 text-4xl font-bold text-white md:text-6xl">
                                ⭐ <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">Premium</span>{' '}
                                Collection
                            </h1>
                            <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-300">
                                Accede a nuestra colección exclusiva de wallpapers premium en resolución 8K. Contenido de la más alta calidad para
                                usuarios premium.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    {/* Filters */}
                    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <input
                                type="text"
                                placeholder="Buscar wallpapers premium..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="rounded-lg border border-gray-600 bg-gray-800/50 px-4 py-2 text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as 'newest' | 'popular' | 'name')}
                                className="rounded-lg border border-gray-600 bg-gray-800/50 px-4 py-2 text-white focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none"
                            >
                                <option value="newest">Más recientes</option>
                                <option value="popular">Más populares</option>
                                <option value="name">Por nombre</option>
                            </select>
                        </div>
                    </div>

                    {/* Wallpapers Grid */}
                    <div
                        className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4'}`}
                    >
                        {sortedWallpapers.map((wallpaper) => (
                            <div
                                key={wallpaper.id}
                                className={`group relative cursor-pointer overflow-hidden rounded-xl bg-gray-800/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20 ${viewMode === 'masonry' ? 'mb-6 break-inside-avoid' : ''}`}
                                onClick={() => setSelectedWallpaper(wallpaper)}
                            >
                                <div className="aspect-[16/10] overflow-hidden">
                                    <img
                                        src={wallpaper.thumbnail}
                                        alt={wallpaper.title}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                    <div className="absolute right-0 bottom-0 left-0 p-4">
                                        <h3 className="mb-1 text-lg font-semibold text-white">{wallpaper.title}</h3>
                                        <p className="mb-2 line-clamp-2 text-sm text-gray-300">{wallpaper.description}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="rounded-full bg-yellow-500/20 px-2 py-1 text-xs text-yellow-400">Premium</span>
                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                <span>👁 {wallpaper.views_count}</span>
                                                <span>⬇ {wallpaper.downloads_count}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {wallpapers.links && wallpapers.links.length > 3 && (
                        <div className="mt-12 flex justify-center">
                            <div className="flex space-x-1">
                                {wallpapers.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                            link.active ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                        } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />

            {/* Wallpaper Modal */}
            {selectedWallpaper && <WallpaperModal wallpaper={selectedWallpaper} onClose={() => setSelectedWallpaper(null)} />}
        </>
    );
}
