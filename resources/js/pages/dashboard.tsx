import DashboardHeader from '@/components/dashboard/dashboard-header';
import DashboardNavigation from '@/components/dashboard/dashboard-navigation';
import FavoritesSection from '@/components/dashboard/sections/FavoritesSection';
import OverviewSection from '@/components/dashboard/sections/overview/OverviewSection';
import SettingsSection from '@/components/dashboard/sections/SettingsSection';
import UploadSection from '@/components/dashboard/sections/UploadSection';
import WallpapersSection from '@/components/dashboard/sections/WallpapersSection';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface Favorite {
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
}

interface DashboardProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
        role: string;
        is_admin: boolean;
    };
    wallpapers?: Array<{
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
    categories?: Array<{
        id: number;
        name: string;
        slug: string;
        wallpaper_count: number;
        total_downloads: number;
        image_url: string;
    }>;
    stats?: {
        total_wallpapers: number;
        total_downloads: number;
        total_categories: number;
        recent_uploads: number;
        total_views: number;
        featured_wallpapers: number;
        weekly_downloads?: number;
    };
    analytics?: {
        downloads_by_category: Array<{
            name: string;
            downloads: number;
        }>;
        popular_wallpapers: Array<{
            title: string;
            downloads_count: number;
            file_path: string;
        }>;
        uploads_by_month: Array<{
            month: number;
            count: number;
        }>;
    };
}

export default function Dashboard({ auth, wallpapers = [], categories = [], stats, analytics }: DashboardProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'wallpapers' | 'favorites' | 'upload' | 'settings'>(
        (localStorage.getItem('activeTab') as 'overview' | 'wallpapers' | 'favorites' | 'upload' | 'settings') ||
            (auth.is_admin ? 'overview' : 'favorites'),
    );
    const [currentWallpapers, setCurrentWallpapers] = useState(wallpapers);
    const [favorites, setFavorites] = useState<Array<Favorite>>([]);
    const [loading, setLoading] = useState(false);
    const [currentStats, setCurrentStats] = useState(stats);

    useEffect(() => {
        if (activeTab === 'favorites') {
            fetchFavorites();
        }
    }, [activeTab]);

    useEffect(() => {
        setCurrentWallpapers(wallpapers);
    }, [wallpapers]);

    useEffect(() => {
        setCurrentStats(stats);
    }, [stats]);

    const refreshStats = () => {
        router.reload({ only: ['stats'] });
    };

    const handleDeleteWallpaper = (wallpaperId: number) => {
        if (confirm('¿Estás seguro de que quieres eliminar este wallpaper?')) {
            router.delete(route('dashboard.wallpapers.destroy', wallpaperId), {
                onSuccess: () => {
                    // Actualizar estado local en lugar de recargar página
                    setCurrentWallpapers((prev) => prev.filter((w) => w.id !== wallpaperId));
                    // Actualizar estadísticas
                    router.reload({ only: ['stats'] });
                },
                onError: (errors) => {
                    console.error('Error al eliminar:', errors);
                },
            });
        }
    };

    const fetchFavorites = async () => {
        setLoading(true);
        try {
            const response = await fetch(route('dashboard.favorites'));
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setFavorites(data.favorites || []);
        } catch (error) {
            console.error('Error fetching favorites:', error);
            setFavorites([]);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFavorite = (wallpaperId: number) => {
        // Optimistically update UI
        setFavorites((prev) => prev.filter((f) => f.id !== wallpaperId));
        setCurrentWallpapers((prev) => prev.map((w) => (w.id === wallpaperId ? { ...w, is_favorited: !w.is_favorited } : w)));

        router.post(
            route('wallpapers.favorite', wallpaperId),
            {},
            {
                onSuccess: () => {
                    // Refetch favorites if on favorites tab
                    if (activeTab === 'favorites') {
                        fetchFavorites();
                    }
                },
                onError: (errors) => {
                    console.error('Error toggling favorite:', errors);
                    // Revert update on error
                    setFavorites((prev) => {
                        fetchFavorites();
                        return prev;
                    });
                    setCurrentWallpapers((prev) => prev.map((w) => (w.id === wallpaperId ? { ...w, is_favorited: !w.is_favorited } : w)));
                },
            },
        );
    };

    return (
        <>
            <Head title="Dashboard - Vision4K">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <DashboardHeader userName={auth.user.name} userRole={auth.role} />

                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Use DashboardNavigation for tab navigation */}
                    <DashboardNavigation
                        activeTab={activeTab}
                        onTabChange={(tab: 'overview' | 'wallpapers' | 'favorites' | 'upload' | 'settings') => {
                            setActiveTab(tab);
                            localStorage.setItem('activeTab', tab);
                            if (tab === 'favorites') {
                                fetchFavorites();
                            }
                        }}
                        auth={auth}
                    />

                    {/* Overview Tab with Analytics */}
                    {activeTab === 'overview' && <OverviewSection categories={categories || []} stats={currentStats} analytics={analytics} />}

                    {/* Upload Tab */}
                    {activeTab === 'upload' && (
                        <UploadSection
                            categories={categories || []}
                            onSubmit={(formData) => {
                                router.post(route('dashboard.store'), formData, {
                                    onSuccess: () => {
                                        alert('Wallpaper(s) subido(s) exitosamente');
                                        // Recargar solo las props necesarias sin cambiar la pestaña
                                        router.reload({ only: ['wallpapers', 'stats', 'categories'] });
                                    },
                                    onError: (errors) => {
                                        console.error('Error:', errors);
                                        alert('Error al subir los wallpapers: ' + JSON.stringify(errors));
                                    },
                                });
                            }}
                        />
                    )}

                    {/* Favorites Tab */}
                    {activeTab === 'favorites' && (
                        <FavoritesSection
                            auth={auth}
                            favorites={favorites}
                            loading={loading}
                            onToggleFavorite={handleToggleFavorite}
                            onRefreshStats={refreshStats}
                        />
                    )}

                    {/* Wallpapers Management */}
                    {activeTab === 'wallpapers' && (
                        <WallpapersSection auth={auth} wallpapers={currentWallpapers || []} onDeleteWallpaper={handleDeleteWallpaper} />
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <SettingsSection
                            auth={auth}
                            onProfileSubmit={(data, callbacks) => {
                                router.patch(route('profile.update'), data, {
                                    onSuccess: () => {
                                        // Profile updated successfully
                                        callbacks?.onSuccess?.();
                                        // Reload the page to get updated user data
                                        router.reload({ only: ['auth'] });
                                    },
                                    onError: (errors) => {
                                        const errorMessage = Object.values(errors).flat().join(', ') || 'Error al actualizar el perfil';
                                        callbacks?.onError?.(errorMessage);
                                    },
                                });
                            }}
                            onPasswordSubmit={(data, callbacks) => {
                                router.put(route('password.update'), data, {
                                    onSuccess: () => {
                                        // Password updated successfully
                                        callbacks?.onSuccess?.();
                                    },
                                    onError: (errors) => {
                                        const errorMessage = Object.values(errors).flat().join(', ') || 'Error al cambiar la contraseña';
                                        callbacks?.onError?.(errorMessage);
                                    },
                                });
                            }}
                            onDeleteAccount={(password, callbacks) => {
                                router.delete(route('profile.destroy'), {
                                    data: { password },
                                    onSuccess: () => {
                                        callbacks?.onSuccess?.();
                                        // User will be redirected by the controller
                                    },
                                    onError: (errors) => {
                                        const errorMessage =
                                            Object.values(errors).flat().join(', ') || 'Error al eliminar la cuenta. Verifica tu contraseña.';
                                        callbacks?.onError?.(errorMessage);
                                    },
                                });
                            }}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
