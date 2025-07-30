import DashboardHeader from '@/components/dashboard/dashboard-header';
import DashboardNavigation from '@/components/dashboard/dashboard-navigation';
import FlashMessages from '@/components/flash-messages';
import Footer from '@/components/footer';
import { Head, router, useForm } from '@inertiajs/react';
import { Edit, Eye, Filter, FolderOpen, Plus, Search, Trash2, Upload } from 'lucide-react';
import { useState } from 'react';

interface DashboardProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
    wallpapers?: Array<{
        id: number;
        title: string;
        description: string;
        file_path: string;
        category: string;
        tags: string[];
        downloads_count: number;
        created_at: string;
    }>;
    categories?: Array<{
        id: number;
        name: string;
        wallpaper_count: number;
    }>;
    stats?: {
        total_wallpapers: number;
        total_downloads: number;
        total_categories: number;
        recent_uploads: number;
    };
}

export default function Dashboard({ auth, wallpapers = [], categories = [], stats }: DashboardProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'wallpapers' | 'upload' | 'categories' | 'analytics'>('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedWallpaper, setSelectedWallpaper] = useState<number | null>(null);
    const [uploadFiles, setUploadFiles] = useState<FileList | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        category_id: '',
        tags: '',
        is_featured: false as boolean,
        is_active: true as boolean,
    });

    // Usar datos reales o datos por defecto
    const displayStats = stats || {
        total_wallpapers: wallpapers.length,
        total_downloads: wallpapers.reduce((sum, w) => sum + w.downloads_count, 0),
        total_categories: categories.length,
        recent_uploads: wallpapers.filter((w) => new Date(w.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length,
    };

    const displayCategories =
        categories.length > 0
            ? categories
            : [
                  { id: 1, name: 'Naturaleza', wallpaper_count: 0 },
                  { id: 2, name: 'Abstracto', wallpaper_count: 0 },
                  { id: 3, name: 'Tecnología', wallpaper_count: 0 },
                  { id: 4, name: 'Espacio', wallpaper_count: 0 },
                  { id: 5, name: 'Minimalista', wallpaper_count: 0 },
                  { id: 6, name: 'Gaming', wallpaper_count: 0 },
              ];

    const displayWallpapers = wallpapers.length > 0 ? wallpapers : [];

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

    const handleDeleteWallpaper = (wallpaperId: number) => {
        if (confirm('¿Estás seguro de que quieres eliminar este wallpaper?')) {
            router.delete(route('dashboard.wallpapers.destroy', wallpaperId), {
                onSuccess: () => {
                    // Recargar datos o actualizar estado local
                },
                onError: (errors) => {
                    console.error('Error al eliminar:', errors);
                },
            });
        }
    };

    const handleEditWallpaper = (wallpaperId: number) => {
        // Implementar lógica de edición
        console.log('Editar wallpaper:', wallpaperId);
    };

    const handleViewWallpaper = (wallpaperId: number) => {
        // Implementar lógica de vista
        console.log('Ver wallpaper:', wallpaperId);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!uploadFiles || uploadFiles.length === 0) {
            alert('Por favor selecciona al menos un archivo');
            return;
        }

        setIsProcessing(true);

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('category_id', data.category_id);
        formData.append('tags', data.tags);
        formData.append('is_featured', data.is_featured ? '1' : '0');
        formData.append('is_active', data.is_active ? '1' : '0');

        // Añadir archivos
        Array.from(uploadFiles).forEach((file, index) => {
            formData.append(`files[${index}]`, file);
        });

        // Enviar usando router.post directamente
        router.post(route('dashboard.store'), formData, {
            onSuccess: () => {
                setIsProcessing(false);
                // Limpiar formulario
                setData({
                    title: '',
                    description: '',
                    category_id: '',
                    tags: '',
                    is_featured: false,
                    is_active: true,
                });
                setUploadFiles(null);

                // Limpiar input de archivo
                const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                if (fileInput) {
                    fileInput.value = '';
                }

                alert('Wallpaper(s) subido(s) exitosamente');
            },
            onError: (errors) => {
                setIsProcessing(false);
                console.error('Error:', errors);
                alert('Error al subir los wallpapers: ' + JSON.stringify(errors));
            },
        });
    };

    return (
        <>
            <Head title="Dashboard - Vision4K">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <FlashMessages />
                <DashboardHeader userName={auth.user.name} />

                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <DashboardNavigation activeTab={activeTab} onTabChange={setActiveTab} />

                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="space-y-8">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                                <div className="rounded-xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm transition-colors hover:bg-white/5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-400">Total Wallpapers</p>
                                            <p className="text-2xl font-bold text-white">{displayStats.total_wallpapers}</p>
                                            <p className="mt-1 text-xs text-green-400">+12 este mes</p>
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
                                            <p className="mt-1 text-xs text-green-400">+2.1k esta semana</p>
                                        </div>
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600/20">
                                            <Upload className="h-6 w-6 text-green-400" />
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm transition-colors hover:bg-white/5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-400">Categorías</p>
                                            <p className="text-2xl font-bold text-white">{displayStats.total_categories}</p>
                                            <p className="mt-1 text-xs text-blue-400">Todas activas</p>
                                        </div>
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600/20">
                                            <FolderOpen className="h-6 w-6 text-blue-400" />
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm transition-colors hover:bg-white/5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-400">Subidos Hoy</p>
                                            <p className="text-2xl font-bold text-white">{displayStats.recent_uploads}</p>
                                            <p className="mt-1 text-xs text-orange-400">Últimas 24h</p>
                                        </div>
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-600/20">
                                            <Plus className="h-6 w-6 text-orange-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Categories Overview */}
                            <div className="rounded-xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
                                <div className="mb-6 flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-white">Categorías Populares</h3>
                                    <button onClick={() => setActiveTab('categories')} className="text-sm text-purple-400 hover:text-purple-300">
                                        Ver todas →
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {displayCategories.slice(0, 6).map((category) => (
                                        <div
                                            key={category.id}
                                            className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
                                        >
                                            <div>
                                                <h4 className="font-medium text-white">{category.name}</h4>
                                                <p className="text-sm text-gray-400">{category.wallpaper_count} wallpapers</p>
                                            </div>
                                            <FolderOpen className="h-5 w-5 text-gray-400" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Wallpapers */}
                            <div className="rounded-xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
                                <div className="mb-6 flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-white">Wallpapers Recientes</h3>
                                    <button onClick={() => setActiveTab('wallpapers')} className="text-sm text-purple-400 hover:text-purple-300">
                                        Ver todos →
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {displayWallpapers.slice(0, 6).map((wallpaper) => (
                                        <div
                                            key={wallpaper.id}
                                            className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/5 transition-all hover:border-purple-500/30"
                                        >
                                            <img
                                                src={wallpaper.file_path}
                                                alt={wallpaper.title}
                                                className="h-32 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                            <div className="absolute right-2 bottom-2 left-2 opacity-0 transition-opacity group-hover:opacity-100">
                                                <div className="flex space-x-2">
                                                    <button className="flex-1 rounded bg-purple-600/80 px-2 py-1 text-xs text-white">Ver</button>
                                                    <button className="flex-1 rounded bg-blue-600/80 px-2 py-1 text-xs text-white">Editar</button>
                                                </div>
                                            </div>
                                            <div className="p-3">
                                                <h4 className="mb-1 truncate text-sm font-medium text-white">{wallpaper.title}</h4>
                                                <div className="flex items-center justify-between text-xs text-gray-400">
                                                    <span>{wallpaper.category}</span>
                                                    <span>{wallpaper.downloads_count} descargas</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
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
                                        <p className="mb-4 text-sm text-gray-400">O haz clic para seleccionar archivos</p>
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
                                        <p className="mt-2 text-xs text-gray-500">Formatos soportados: JPG, PNG, WebP (máx. 10MB)</p>
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
                                            <label className="mb-2 block font-medium text-white">Título</label>
                                            <input
                                                type="text"
                                                value={data.title}
                                                onChange={(e) => setData('title', e.target.value)}
                                                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                                                placeholder="Nombre del wallpaper"
                                            />
                                            {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
                                        </div>

                                        <div>
                                            <label className="mb-2 block font-medium text-white">Categoría</label>
                                            <select
                                                value={data.category_id}
                                                onChange={(e) => setData('category_id', e.target.value)}
                                                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                                            >
                                                <option value="">Seleccionar categoría</option>
                                                {displayCategories.map((category) => (
                                                    <option key={category.id} value={category.id} className="bg-gray-800">
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.category_id && <p className="mt-1 text-sm text-red-400">{errors.category_id}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block font-medium text-white">Descripción</label>
                                        <textarea
                                            rows={3}
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                                            placeholder="Descripción del wallpaper"
                                        />
                                        {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-2 block font-medium text-white">Tags</label>
                                        <input
                                            type="text"
                                            value={data.tags}
                                            onChange={(e) => setData('tags', e.target.value)}
                                            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                                            placeholder="naturaleza, paisaje, montañas (separados por comas)"
                                        />
                                        {errors.tags && <p className="mt-1 text-sm text-red-400">{errors.tags}</p>}
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={data.is_featured}
                                                onChange={(e) => setData('is_featured', e.target.checked)}
                                                className="rounded border-white/20 bg-white/10 text-purple-600 focus:ring-purple-500/50"
                                            />
                                            <span className="text-gray-300">Destacar wallpaper</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={data.is_active}
                                                onChange={(e) => setData('is_active', e.target.checked)}
                                                className="rounded border-white/20 bg-white/10 text-purple-600 focus:ring-purple-500/50"
                                            />
                                            <span className="text-gray-300">Publicar inmediatamente</span>
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isProcessing}
                                        className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-semibold text-white transition-colors hover:from-purple-700 hover:to-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {isProcessing ? 'Subiendo...' : 'Subir Wallpaper'}
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
                                                    <button
                                                        onClick={() => handleViewWallpaper(wallpaper.id)}
                                                        className="rounded-lg bg-black/60 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
                                                        title="Ver wallpaper"
                                                    >
                                                        <Eye size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditWallpaper(wallpaper.id)}
                                                        className="rounded-lg bg-black/60 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
                                                        title="Editar wallpaper"
                                                    >
                                                        <Edit size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteWallpaper(wallpaper.id)}
                                                        className="rounded-lg bg-black/60 p-2 text-red-400 backdrop-blur-sm transition-colors hover:bg-red-600/80"
                                                        title="Eliminar wallpaper"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h4 className="mb-2 truncate font-medium text-white">{wallpaper.title}</h4>
                                                <p className="mb-3 line-clamp-2 text-sm text-gray-400">{wallpaper.description}</p>
                                                <div className="mb-3 flex items-center justify-between text-xs text-gray-500">
                                                    <span className="rounded bg-purple-600/20 px-2 py-1 text-purple-400">{wallpaper.category}</span>
                                                    <span>{wallpaper.downloads_count} descargas</span>
                                                </div>
                                                <div className="mb-3 flex flex-wrap gap-1">
                                                    {wallpaper.tags.slice(0, 3).map((tag, index) => (
                                                        <span key={index} className="rounded bg-white/10 px-2 py-1 text-xs text-gray-400">
                                                            {tag}
                                                        </span>
                                                    ))}
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

                    {/* Categories Management */}
                    {activeTab === 'categories' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-white">Gestión de Categorías</h2>
                                <button className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 font-medium text-white transition-colors hover:from-purple-700 hover:to-pink-700">
                                    <Plus size={18} className="mr-2 inline" />
                                    Nueva Categoría
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {displayCategories.map((category) => (
                                    <div
                                        key={category.id}
                                        className="rounded-xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm transition-all hover:border-purple-500/30"
                                    >
                                        <div className="mb-4 flex items-start justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-purple-600/20 to-pink-600/20">
                                                    <FolderOpen className="h-6 w-6 text-purple-400" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-white">{category.name}</h3>
                                                    <p className="text-sm text-gray-400">{category.wallpaper_count} wallpapers</p>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button className="rounded-lg bg-white/10 p-2 text-gray-400 transition-colors hover:text-white">
                                                    <Edit size={16} />
                                                </button>
                                                <button className="rounded-lg bg-white/10 p-2 text-red-400 transition-colors hover:bg-red-600/20">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-white/10">
                                            <div
                                                className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"
                                                style={{
                                                    width: `${displayCategories.length > 0 ? (category.wallpaper_count / Math.max(...displayCategories.map((c) => c.wallpaper_count))) * 100 : 0}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Analytics Tab */}
                    {activeTab === 'analytics' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white">Analíticas y Estadísticas</h2>

                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                <div className="rounded-xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
                                    <h3 className="mb-4 text-lg font-semibold text-white">Descargas por Categoría</h3>
                                    <div className="space-y-3">
                                        {displayCategories.map((category) => (
                                            <div key={category.id} className="flex items-center justify-between">
                                                <span className="text-gray-300">{category.name}</span>
                                                <div className="flex items-center space-x-3">
                                                    <div className="h-2 w-24 rounded-full bg-white/10">
                                                        <div
                                                            className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"
                                                            style={{
                                                                width: `${displayCategories.length > 0 ? (category.wallpaper_count / Math.max(...displayCategories.map((c) => c.wallpaper_count))) * 100 : 0}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="w-8 text-right text-sm text-white">{category.wallpaper_count}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
                                    <h3 className="mb-4 text-lg font-semibold text-white">Wallpapers Más Populares</h3>
                                    <div className="space-y-3">
                                        {displayWallpapers
                                            .sort((a, b) => b.downloads_count - a.downloads_count)
                                            .slice(0, 5)
                                            .map((wallpaper) => (
                                                <div key={wallpaper.id} className="flex items-center space-x-3">
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
                        </div>
                    )}
                </div>

                <Footer />
            </div>
        </>
    );
}
