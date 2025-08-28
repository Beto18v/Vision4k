import DashboardHeader from '@/components/dashboard/dashboard-header';
import FlashMessages from '@/components/flash-messages';
import { Head, router, useForm } from '@inertiajs/react';
import { BarChart3, Eye, Filter, FolderOpen, Lock, Monitor, Moon, Plus, Save, Search, Settings, Star, Sun, Trash2, Upload, User } from 'lucide-react';
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
    const [activeTab, setActiveTab] = useState<'overview' | 'wallpapers' | 'upload' | 'settings'>('overview');
    const [settingsTab, setSettingsTab] = useState<'profile' | 'password' | 'appearance' | 'account'>('profile');
    const [appearance, setAppearance] = useState<'light' | 'dark' | 'system'>('system');
    const [searchTerm, setSearchTerm] = useState('');
    const [uploadFiles, setUploadFiles] = useState<FileList | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showCreateCategory, setShowCreateCategory] = useState(false);

    // Formulario para crear categorías
    const {
        data: categoryData,
        setData: setCategoryData,
        errors: categoryErrors,
        post: postCategory,
        processing: categoryProcessing,
    } = useForm({
        name: '',
        image: null as File | null,
    });

    // Formulario para subir wallpapers
    const {
        data: uploadData,
        setData: setUploadData,
        errors: uploadErrors,
    } = useForm({
        title: '',
        category_id: '',
    });

    // Formulario para perfil
    const {
        data: profileData,
        setData: setProfileData,
        errors: profileErrors,
        post: postProfile,
        processing: profileProcessing,
    } = useForm({
        name: auth.user.name,
        email: auth.user.email,
        avatar: null as File | null,
    });

    // Formulario para contraseña
    const {
        data: passwordData,
        setData: setPasswordData,
        errors: passwordErrors,
        put: putPassword,
        processing: passwordProcessing,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // Formulario para eliminación de cuenta
    const {
        data: deleteData,
        setData: setDeleteData,
        errors: deleteErrors,
        delete: deleteAccount,
        processing: deleteProcessing,
    } = useForm({
        password: '',
    });

    // Handlers para formularios de configuración
    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', profileData.name);
        formData.append('email', profileData.email);
        if (profileData.avatar) {
            formData.append('avatar', profileData.avatar);
        }

        router.post(route('settings.profile.update'), formData, {
            onSuccess: () => {
                setProfileData('avatar', null);
                // Limpiar input de archivo
                const fileInput = document.getElementById('avatar-upload') as HTMLInputElement;
                if (fileInput) {
                    fileInput.value = '';
                }
            },
        });
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        putPassword(route('settings.password.update'), {
            onSuccess: () => {
                setPasswordData({
                    current_password: '',
                    password: '',
                    password_confirmation: '',
                });
            },
        });
    };

    const handleDeleteAccount = (e: React.FormEvent) => {
        e.preventDefault();

        if (confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
            deleteAccount(route('settings.account.destroy'));
        }
    };

    // Usar datos reales o valores vacíos (no datos por defecto)
    const displayStats = stats || {
        total_wallpapers: 0,
        total_downloads: 0,
        total_categories: 0,
        recent_uploads: 0,
        total_views: 0,
        featured_wallpapers: 0,
    };

    const displayCategories = categories || [];
    const displayWallpapers = wallpapers || [];

    // Drag and drop handlers
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setUploadFiles(e.dataTransfer.files);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setUploadFiles(e.target.files);
        }
    };

    // Crear categoría
    const handleCreateCategory = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', categoryData.name);
        if (categoryData.image) {
            formData.append('image', categoryData.image);
        }

        router.post(route('dashboard.categories.store'), formData, {
            onSuccess: () => {
                setCategoryData({ name: '', image: null });
                setShowCreateCategory(false);
                // Recargar página para mostrar nueva categoría
                window.location.reload();
            },
        });
    };

    // Subir wallpapers
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!uploadFiles || uploadFiles.length === 0) {
            alert('Por favor selecciona al menos un archivo');
            return;
        }

        if (uploadFiles.length > 20) {
            alert('Máximo 20 archivos permitidos');
            return;
        }

        if (!uploadData.category_id) {
            alert('Por favor selecciona una categoría');
            return;
        }

        setIsProcessing(true);

        const formData = new FormData();
        formData.append('title', uploadData.title || '');
        formData.append('category_id', uploadData.category_id);

        // Añadir archivos
        Array.from(uploadFiles).forEach((file, index) => {
            formData.append(`files[${index}]`, file);
        });

        router.post(route('dashboard.store'), formData, {
            onSuccess: () => {
                setIsProcessing(false);
                setUploadData({ title: '', category_id: '' });
                setUploadFiles(null);
                // Limpiar input de archivo
                const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                if (fileInput) {
                    fileInput.value = '';
                }
                alert('Wallpaper(s) subido(s) exitosamente');
                // Recargar página para mostrar nuevos wallpapers
                window.location.reload();
            },
            onError: (errors) => {
                setIsProcessing(false);
                console.error('Error:', errors);
                alert('Error al subir los wallpapers: ' + JSON.stringify(errors));
            },
        });
    };

    const handleDeleteWallpaper = (wallpaperId: number) => {
        if (confirm('¿Estás seguro de que quieres eliminar este wallpaper?')) {
            router.delete(route('dashboard.wallpapers.destroy', wallpaperId), {
                onSuccess: () => {
                    window.location.reload();
                },
                onError: (errors) => {
                    console.error('Error al eliminar:', errors);
                },
            });
        }
    };

    const handleViewWallpaper = (wallpaperId: number) => {
        router.visit(route('wallpapers.show', wallpaperId));
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
                                { key: 'wallpapers', label: auth.is_admin ? 'Wallpapers' : 'Favoritos', icon: FolderOpen },
                                ...(auth.is_admin
                                    ? [
                                          { key: 'upload', label: 'Subir', icon: Upload },
                                          { key: 'settings', label: 'Configuración', icon: Settings },
                                      ]
                                    : [{ key: 'settings', label: 'Configuración', icon: Settings }]),
                            ].map(({ key, label, icon: Icon }) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveTab(key as any)}
                                    className={`flex items-center space-x-2 rounded-lg px-4 py-2 font-medium transition-colors ${
                                        activeTab === key
                                            ? 'bg-purple-600 text-white'
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
                        <div className="space-y-8">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                                <div className="rounded-xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm transition-colors hover:bg-white/5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-400">Total Wallpapers</p>
                                            <p className="text-2xl font-bold text-white">{displayStats.total_wallpapers}</p>
                                            <p className="mt-1 text-xs text-green-400">+{displayStats.recent_uploads} hoy</p>
                                        </div>
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600/20">
                                            <FolderOpen className="h-6 w-6 text-purple-400" />
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm transition-colors hover:bg-white/5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-400">Total Descargas</p>
                                            <p className="text-2xl font-bold text-white">{displayStats.total_downloads.toLocaleString()}</p>
                                            <p className="mt-1 text-xs text-green-400">+{displayStats.weekly_downloads || 0} esta semana</p>
                                        </div>
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600/20">
                                            <Upload className="h-6 w-6 text-green-400" />
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm transition-colors hover:bg-white/5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-400">Total Vistas</p>
                                            <p className="text-2xl font-bold text-white">{displayStats.total_views.toLocaleString()}</p>
                                            <p className="mt-1 text-xs text-blue-400">Todas activas</p>
                                        </div>
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600/20">
                                            <Eye className="h-6 w-6 text-blue-400" />
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm transition-colors hover:bg-white/5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-400">Categorías</p>
                                            <p className="text-2xl font-bold text-white">{displayStats.total_categories}</p>
                                            <p className="mt-1 text-xs text-orange-400">Todas activas</p>
                                        </div>
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-600/20">
                                            <FolderOpen className="h-6 w-6 text-orange-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Categories Overview */}
                            <div className="rounded-xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
                                <div className="mb-6 flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-white">Categorías Populares</h3>
                                    <button onClick={() => setShowCreateCategory(true)} className="text-sm text-purple-400 hover:text-purple-300">
                                        <Plus size={16} className="mr-1 inline" />
                                        Gestionar
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {displayCategories.slice(0, 6).map((category) => (
                                        <div
                                            key={category.id}
                                            className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg">
                                                    <FolderOpen className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-white">{category.name}</h4>
                                                    <p className="text-sm text-gray-400">{category.wallpaper_count} wallpapers</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-white">{category.total_downloads}</p>
                                                <p className="text-xs text-gray-400">descargas</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Analytics Section */}
                            {analytics && (
                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                    <div className="rounded-xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
                                        <h3 className="mb-4 text-lg font-semibold text-white">Descargas por Categoría</h3>
                                        <div className="space-y-3">
                                            {analytics.downloads_by_category.slice(0, 5).map((category, index) => {
                                                const progress = category.downloads % 100;
                                                const currentGoal = Math.floor(category.downloads / 100) * 100;
                                                const nextGoal = currentGoal + 100;
                                                const progressPercentage = (progress / 100) * 100;

                                                return (
                                                    <div key={index} className="flex items-center justify-between">
                                                        <span className="text-gray-300">{category.name}</span>
                                                        <div className="flex items-center space-x-3">
                                                            <div className="h-2 w-24 rounded-full bg-white/10">
                                                                <div
                                                                    className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300"
                                                                    style={{
                                                                        width: `${progressPercentage}%`,
                                                                    }}
                                                                />
                                                            </div>
                                                            <span className="w-16 text-right text-xs text-white">
                                                                {progress}/{100}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
                                        <h3 className="mb-4 text-lg font-semibold text-white">Wallpapers Más Populares</h3>
                                        <div className="space-y-3">
                                            {analytics.popular_wallpapers.slice(0, 5).map((wallpaper, index) => (
                                                <div key={index} className="flex items-center space-x-3">
                                                    <img src={wallpaper.file_path} alt={wallpaper.title} className="h-8 w-12 rounded object-cover" />
                                                    <div className="flex-1">
                                                        <p className="truncate text-sm font-medium text-white">{wallpaper.title}</p>
                                                        <p className="text-xs text-gray-400">{wallpaper.downloads_count} descargas</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Upload Tab */}
                    {activeTab === 'upload' && (
                        <div className="mx-auto max-w-2xl">
                            <div className="rounded-xl border border-white/10 bg-black/20 p-8 backdrop-blur-sm">
                                <h2 className="mb-6 text-2xl font-bold text-white">Subir Nuevo Wallpaper</h2>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* File Upload Area */}
                                    <div
                                        className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
                                            dragActive ? 'border-purple-500 bg-purple-500/10' : 'border-white/20 hover:border-purple-500/50'
                                        }`}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                    >
                                        <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                                        <p className="mb-2 text-white">Arrastra y suelta tus imágenes aquí</p>
                                        <p className="mb-4 text-sm text-gray-400">O haz clic para seleccionar archivos (máx. 20)</p>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="hidden"
                                            id="file-upload"
                                            onChange={handleFileSelect}
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className="inline-block cursor-pointer rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-medium text-white transition-colors hover:from-purple-700 hover:to-pink-700"
                                        >
                                            Seleccionar Archivos
                                        </label>
                                        <p className="mt-2 text-xs text-gray-500">Formatos soportados: JPG, PNG, WebP (máx. 10MB cada uno)</p>
                                        {uploadFiles && uploadFiles.length > 0 && (
                                            <div className="mt-4">
                                                <p className="text-sm text-green-400">{uploadFiles.length} archivo(s) seleccionado(s)</p>
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {Array.from(uploadFiles).map((file, index) => (
                                                        <span key={index} className="rounded bg-white/10 px-2 py-1 text-xs text-white">
                                                            {file.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Form Fields */}
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block font-medium text-white">Título (opcional)</label>
                                            <input
                                                type="text"
                                                value={uploadData.title}
                                                onChange={(e) => setUploadData('title', e.target.value)}
                                                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                                                placeholder="Título del wallpaper"
                                            />
                                            {uploadErrors.title && <p className="mt-1 text-sm text-red-400">{uploadErrors.title}</p>}
                                        </div>

                                        <div>
                                            <label className="mb-2 block font-medium text-white">Categoría</label>
                                            <select
                                                value={uploadData.category_id}
                                                onChange={(e) => setUploadData('category_id', e.target.value)}
                                                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                                            >
                                                <option value="">Seleccionar categoría</option>
                                                {displayCategories.map((category) => (
                                                    <option key={category.id} value={category.id} className="bg-gray-800">
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {uploadErrors.category_id && <p className="mt-1 text-sm text-red-400">{uploadErrors.category_id}</p>}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isProcessing || !uploadData.category_id}
                                        className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-semibold text-white transition-colors hover:from-purple-700 hover:to-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {isProcessing ? 'Subiendo...' : 'Subir Wallpaper(s)'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Wallpapers Management */}
                    {activeTab === 'wallpapers' && (
                        <div className="space-y-6">
                            {/* Search and Filters */}
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <div className="relative flex-1">
                                    <Search className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full rounded-xl border border-white/20 bg-white/10 py-3 pr-4 pl-10 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                                        placeholder="Buscar wallpapers..."
                                    />
                                </div>
                                <button className="flex items-center space-x-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-gray-300 transition-colors hover:text-white">
                                    <Filter size={20} />
                                    <span>Filtros</span>
                                </button>
                            </div>

                            {/* Wallpapers Grid */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {displayWallpapers
                                    .filter(
                                        (w) =>
                                            w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            w.category.toLowerCase().includes(searchTerm.toLowerCase()),
                                    )
                                    .map((wallpaper) => (
                                        <div
                                            key={wallpaper.id}
                                            className="overflow-hidden rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm transition-all hover:border-purple-500/30"
                                        >
                                            <div className="relative">
                                                <img src={wallpaper.file_path} alt={wallpaper.title} className="h-48 w-full object-cover" />
                                                <div className="absolute top-2 right-2 flex space-x-1">
                                                    {wallpaper.is_favorited && <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />}
                                                </div>
                                                <div className="absolute top-2 left-2">
                                                    <button
                                                        onClick={() => handleViewWallpaper(wallpaper.id)}
                                                        className="rounded-lg bg-black/60 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
                                                        title="Ver wallpaper"
                                                    >
                                                        <Eye size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h4 className="mb-2 truncate font-medium text-white">{wallpaper.title}</h4>
                                                <p className="mb-3 text-sm text-gray-400">{wallpaper.category}</p>
                                                <div className="mb-3 flex items-center justify-between text-xs text-gray-500">
                                                    <span>{wallpaper.downloads_count} descargas</span>
                                                    <span>{wallpaper.views_count} vistas</span>
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Subido: {new Date(wallpaper.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className="space-y-6">
                            {/* Settings Navigation - Integrated */}
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSettingsTab('profile')}
                                    className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                        settingsTab === 'profile'
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                                    }`}
                                >
                                    <User className="h-4 w-4" />
                                    <span>Perfil</span>
                                </button>
                                <button
                                    onClick={() => setSettingsTab('password')}
                                    className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                        settingsTab === 'password'
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                                    }`}
                                >
                                    <Lock className="h-4 w-4" />
                                    <span>Contraseña</span>
                                </button>
                                <button
                                    onClick={() => setSettingsTab('appearance')}
                                    className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                        settingsTab === 'appearance'
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                                    }`}
                                >
                                    <Settings className="h-4 w-4" />
                                    <span>Apariencia</span>
                                </button>
                                <button
                                    onClick={() => setSettingsTab('account')}
                                    className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                        settingsTab === 'account'
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                                    }`}
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span>Cuenta</span>
                                </button>
                            </div>

                            {/* Profile Settings */}
                            {settingsTab === 'profile' && (
                                <div className="rounded-xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
                                    <div className="mb-6 flex items-center space-x-3">
                                        <User className="h-5 w-5 text-purple-400" />
                                        <h3 className="text-lg font-semibold text-white">Información del Perfil</h3>
                                    </div>

                                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-white">Nombre</label>
                                                <input
                                                    type="text"
                                                    value={profileData.name}
                                                    onChange={(e) => setProfileData('name', e.target.value)}
                                                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                                                    placeholder="Tu nombre completo"
                                                />
                                                {profileErrors.name && <p className="mt-1 text-sm text-red-400">{profileErrors.name}</p>}
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-white">Correo electrónico</label>
                                                <input
                                                    type="email"
                                                    value={profileData.email}
                                                    onChange={(e) => setProfileData('email', e.target.value)}
                                                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                                                    placeholder="tu@email.com"
                                                />
                                                {profileErrors.email && <p className="mt-1 text-sm text-red-400">{profileErrors.email}</p>}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-white">Avatar</label>
                                            <input
                                                id="avatar-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setProfileData('avatar', e.target.files?.[0] || null)}
                                                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white file:mr-4 file:rounded-lg file:border-0 file:bg-purple-600 file:px-3 file:py-1 file:text-white file:hover:bg-purple-700 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                                            />
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <span
                                                className={`rounded-full px-3 py-1 text-sm font-medium ${
                                                    auth.is_admin ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                                                }`}
                                            >
                                                {auth.role}
                                            </span>
                                            <span className="text-sm text-gray-400">Rol actual</span>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={profileProcessing}
                                            className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-medium text-white transition-all hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
                                        >
                                            <Save className="h-4 w-4" />
                                            <span>{profileProcessing ? 'Guardando...' : 'Guardar Cambios'}</span>
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Password Settings */}
                            {settingsTab === 'password' && (
                                <div className="rounded-xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
                                    <div className="mb-6 flex items-center space-x-3">
                                        <Lock className="h-5 w-5 text-purple-400" />
                                        <h3 className="text-lg font-semibold text-white">Cambiar Contraseña</h3>
                                    </div>

                                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-white">Contraseña Actual</label>
                                            <input
                                                type="password"
                                                value={passwordData.current_password}
                                                onChange={(e) => setPasswordData('current_password', e.target.value)}
                                                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                                                placeholder="Ingresa tu contraseña actual"
                                            />
                                            {passwordErrors.current_password && (
                                                <p className="mt-1 text-sm text-red-400">{passwordErrors.current_password}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-white">Nueva Contraseña</label>
                                                <input
                                                    type="password"
                                                    value={passwordData.password}
                                                    onChange={(e) => setPasswordData('password', e.target.value)}
                                                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                                                    placeholder="Nueva contraseña"
                                                />
                                                {passwordErrors.password && <p className="mt-1 text-sm text-red-400">{passwordErrors.password}</p>}
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-white">Confirmar Contraseña</label>
                                                <input
                                                    type="password"
                                                    value={passwordData.password_confirmation}
                                                    onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                                                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                                                    placeholder="Confirma la nueva contraseña"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={passwordProcessing}
                                            className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-medium text-white transition-all hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
                                        >
                                            <Save className="h-4 w-4" />
                                            <span>{passwordProcessing ? 'Actualizando...' : 'Actualizar Contraseña'}</span>
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Appearance Settings */}
                            {settingsTab === 'appearance' && (
                                <div className="rounded-xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
                                    <div className="mb-6 flex items-center space-x-3">
                                        <Settings className="h-5 w-5 text-purple-400" />
                                        <h3 className="text-lg font-semibold text-white">Apariencia</h3>
                                    </div>

                                    <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                                        <p className="mb-4 text-sm text-gray-400">
                                            Elige cómo quieres que se vea la aplicación. Puedes elegir entre modo claro, oscuro o seguir la
                                            configuración de tu sistema.
                                        </p>

                                        <div className="flex items-center space-x-4">
                                            <button
                                                onClick={() => setAppearance('light')}
                                                className={`flex items-center space-x-2 rounded-lg border px-4 py-2 transition-colors ${
                                                    appearance === 'light'
                                                        ? 'border-purple-500 bg-purple-500/20 text-white'
                                                        : 'border-white/20 bg-white/5 text-gray-400 hover:bg-white/10'
                                                }`}
                                            >
                                                <Sun className="h-4 w-4" />
                                                <span>Claro</span>
                                            </button>

                                            <button
                                                onClick={() => setAppearance('dark')}
                                                className={`flex items-center space-x-2 rounded-lg border px-4 py-2 transition-colors ${
                                                    appearance === 'dark'
                                                        ? 'border-purple-500 bg-purple-500/20 text-white'
                                                        : 'border-white/20 bg-white/5 text-gray-400 hover:bg-white/10'
                                                }`}
                                            >
                                                <Moon className="h-4 w-4" />
                                                <span>Oscuro</span>
                                            </button>

                                            <button
                                                onClick={() => setAppearance('system')}
                                                className={`flex items-center space-x-2 rounded-lg border px-4 py-2 transition-colors ${
                                                    appearance === 'system'
                                                        ? 'border-purple-500 bg-purple-500/20 text-white'
                                                        : 'border-white/20 bg-white/5 text-gray-400 hover:bg-white/10'
                                                }`}
                                            >
                                                <Monitor className="h-4 w-4" />
                                                <span>Sistema</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Account Settings */}
                            {settingsTab === 'account' && (
                                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 backdrop-blur-sm">
                                    <div className="mb-6 flex items-center space-x-3">
                                        <Trash2 className="h-5 w-5 text-red-400" />
                                        <h3 className="text-lg font-semibold text-white">Eliminar Cuenta</h3>
                                    </div>

                                    <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
                                        <div className="mb-4">
                                            <h4 className="mb-2 text-lg font-medium text-white">¿Estás seguro?</h4>
                                            <p className="text-sm text-gray-400">
                                                Una vez que elimines tu cuenta, todos tus recursos y datos serán eliminados permanentemente. Por favor
                                                ingresa tu contraseña para confirmar que deseas eliminar tu cuenta.
                                            </p>
                                        </div>

                                        <form onSubmit={handleDeleteAccount} className="space-y-4">
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-white">Contraseña</label>
                                                <input
                                                    type="password"
                                                    value={deleteData.password}
                                                    onChange={(e) => setDeleteData('password', e.target.value)}
                                                    className="w-full rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500/50 focus:outline-none"
                                                    placeholder="Ingresa tu contraseña para confirmar"
                                                />
                                                {deleteErrors.password && <p className="mt-1 text-sm text-red-400">{deleteErrors.password}</p>}
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={deleteProcessing}
                                                className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 px-6 py-3 font-medium text-white transition-all hover:from-red-700 hover:to-pink-700 disabled:opacity-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span>{deleteProcessing ? 'Eliminando...' : 'Eliminar Cuenta'}</span>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Create Category Modal */}
            {showCreateCategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
                        <h3 className="mb-4 text-xl font-bold text-white">Crear Nueva Categoría</h3>
                        <form onSubmit={handleCreateCategory} className="space-y-4">
                            <div>
                                <label className="mb-2 block font-medium text-white">Nombre</label>
                                <input
                                    type="text"
                                    value={categoryData.name}
                                    onChange={(e) => setCategoryData('name', e.target.value)}
                                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                                    placeholder="Nombre de la categoría"
                                    required
                                />
                                {categoryErrors.name && <p className="mt-1 text-sm text-red-400">{categoryErrors.name}</p>}
                            </div>
                            <div>
                                <label className="mb-2 block font-medium text-white">Imagen (opcional)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setCategoryData('image', e.target.files?.[0] || null)}
                                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white file:mr-4 file:rounded-lg file:border-0 file:bg-purple-600 file:px-3 file:py-1 file:text-white file:transition-colors hover:file:bg-purple-700"
                                />
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateCategory(false)}
                                    className="flex-1 rounded-xl border border-white/20 bg-white/10 py-3 font-medium text-white transition-colors hover:bg-white/20"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={categoryProcessing}
                                    className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-medium text-white transition-colors hover:from-purple-700 hover:to-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {categoryProcessing ? 'Creando...' : 'Crear'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
