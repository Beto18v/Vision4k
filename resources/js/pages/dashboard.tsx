import CreateCategoryModal from '@/components/dashboard/CreateCategoryModal';
import DashboardHeader from '@/components/dashboard/dashboard-header';
import FavoritesSection from '@/components/dashboard/sections/FavoritesSection';
import OverviewSection from '@/components/dashboard/sections/OverviewSection';
import SettingsSection from '@/components/dashboard/sections/SettingsSection';
import UploadSection from '@/components/dashboard/sections/UploadSection';
import WallpapersSection from '@/components/dashboard/sections/WallpapersSection';
import FlashMessages from '@/components/flash-messages';
import { Head, router } from '@inertiajs/react';
import { BarChart3, FolderOpen, Settings, Star, Upload } from 'lucide-react';
import { useState } from 'react';

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
    const [activeTab, setActiveTab] = useState<'overview' | 'wallpapers' | 'favorites' | 'upload' | 'settings'>('overview');
    const [showCreateCategory, setShowCreateCategory] = useState(false);
    const [currentCategories, setCurrentCategories] = useState(categories);
    const [currentWallpapers, setCurrentWallpapers] = useState(wallpapers);
    const [favorites, setFavorites] = useState<Array<any>>([]);
    const [loading, setLoading] = useState(false);

    const handleDeleteWallpaper = (wallpaperId: number) => {
        if (confirm('¿Estás seguro de que quieres eliminar este wallpaper?')) {
            router.delete(route('dashboard.wallpapers.destroy', wallpaperId), {
                onSuccess: () => {
                    // Actualizar estado local en lugar de recargar página
                    setCurrentWallpapers((prev) => prev.filter((w) => w.id !== wallpaperId));
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
        router.post(
            route('wallpapers.favorite', wallpaperId),
            {},
            {
                onError: (errors) => {
                    console.error('Error toggling favorite:', errors);
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
                <FlashMessages />
                <DashboardHeader userName={auth.user.name} userRole={auth.role} />

                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Custom Navigation without Analytics */}
                    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-2">
                            {[
                                { key: 'overview', label: 'Resumen', icon: BarChart3 },
                                { key: 'wallpapers', label: auth.is_admin ? 'Wallpapers' : 'Todos', icon: FolderOpen },
                                { key: 'favorites', label: 'Favoritos', icon: Star },
                                ...(auth.is_admin
                                    ? [
                                          { key: 'upload', label: 'Subir', icon: Upload },
                                          { key: 'settings', label: 'Configuración', icon: Settings },
                                      ]
                                    : [{ key: 'settings', label: 'Configuración', icon: Settings }]),
                            ].map(({ key, label, icon: Icon }) => (
                                <button
                                    key={key}
                                    onClick={() => {
                                        setActiveTab(key as any);
                                        if (key === 'favorites') {
                                            fetchFavorites();
                                        }
                                    }}
                                    className={`flex items-center space-x-2 rounded-lg px-4 py-2 font-medium transition-colors ${
                                        activeTab === key
                                            ? key === 'favorites'
                                                ? 'bg-red-600 text-white'
                                                : 'bg-purple-600 text-white'
                                            : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                                    }`}
                                >
                                    <Icon size={18} />
                                    <span>{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Overview Tab with Analytics */}
                    {activeTab === 'overview' && (
                        <OverviewSection
                            auth={auth}
                            categories={currentCategories || []}
                            stats={
                                stats || {
                                    total_wallpapers: 0,
                                    total_downloads: 0,
                                    total_categories: 0,
                                    recent_uploads: 0,
                                    total_views: 0,
                                    featured_wallpapers: 0,
                                }
                            }
                            analytics={analytics}
                            onCreateCategory={() => setShowCreateCategory(true)}
                        />
                    )}

                    {/* Upload Tab */}
                    {activeTab === 'upload' && (
                        <UploadSection
                            auth={auth}
                            categories={currentCategories || []}
                            onSubmit={(formData) => {
                                router.post(route('dashboard.store'), formData, {
                                    onSuccess: () => {
                                        alert('Wallpaper(s) subido(s) exitosamente');
                                        // Actualizar estado local en lugar de recargar
                                        router.reload();
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
                        <FavoritesSection auth={auth} favorites={favorites} loading={loading} onToggleFavorite={handleToggleFavorite} />
                    )}

                    {/* Wallpapers Management */}
                    {activeTab === 'wallpapers' && (
                        <WallpapersSection
                            auth={auth}
                            wallpapers={currentWallpapers || []}
                            onDeleteWallpaper={handleDeleteWallpaper}
                            onToggleFavorite={handleToggleFavorite}
                        />
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <SettingsSection
                            auth={auth}
                            onProfileSubmit={(formData) => {
                                router.post(route('settings.profile.update'), formData, {
                                    onSuccess: () => {
                                        // Limpiar input de archivo
                                        const fileInput = document.getElementById('avatar-upload') as HTMLInputElement;
                                        if (fileInput) {
                                            fileInput.value = '';
                                        }
                                    },
                                });
                            }}
                            onPasswordSubmit={(data) => {
                                router.put(route('settings.password.update'), data, {
                                    onSuccess: () => {
                                        // Reset form data is handled in the component
                                    },
                                });
                            }}
                            onDeleteAccount={(password) => {
                                if (confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
                                    router.delete(route('settings.account.destroy'), {
                                        data: { password },
                                    });
                                }
                            }}
                        />
                    )}
                </div>
            </div>

            {/* Create Category Modal */}
            <CreateCategoryModal
                isOpen={showCreateCategory}
                onClose={() => setShowCreateCategory(false)}
                onSubmit={(formData) => {
                    router.post(route('dashboard.categories.store'), formData, {
                        onSuccess: (page) => {
                            setShowCreateCategory(false);
                            // Actualizar estado local con la nueva categoría
                            const newCategories = (page.props.categories as Array<any>) || [];
                            setCurrentCategories(newCategories);
                            alert('Categoría creada exitosamente');
                        },
                        onError: (errors) => {
                            console.error('Error al crear categoría:', errors);
                            // Mostrar mensaje de error más específico
                            if (errors.image) {
                                alert('Error con la imagen: ' + errors.image);
                            } else if (errors.name) {
                                alert('Error con el nombre: ' + errors.name);
                            } else {
                                alert('Error al crear la categoría: ' + JSON.stringify(errors));
                            }
                        },
                    });
                }}
                onSuccess={() => {
                    // Reset form data when successful
                    setCurrentCategories([...currentCategories]); // This will trigger a re-render
                }}
            />
        </>
    );
}
