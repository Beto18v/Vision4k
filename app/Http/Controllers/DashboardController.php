<?php

/**
 * Controlador Dashboard - Gestiona el panel de administración de Vision4K
 *
 * Funcionalidades: estadísticas en tiempo real, gestión de wallpapers/categorías, roles
 * Métodos principales: index(), store(), update(), destroy(), storeCategory(), analytics()
 * Control de acceso: Admin (acceso completo), User (estadísticas básicas)
 */

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Download;
use App\Models\Favorite;
use App\Models\Wallpaper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Obtener estadísticas en tiempo real
        $stats = [
            'total_wallpapers' => Wallpaper::count(),
            'total_downloads' => Wallpaper::sum('downloads_count'),
            'total_categories' => Category::where('is_active', true)->count(),
            'recent_uploads' => Wallpaper::whereDate('created_at', today())->count(),
            'total_views' => Wallpaper::sum('views_count'),
            'featured_wallpapers' => Wallpaper::where('is_featured', true)->count(),
            'weekly_downloads' => Download::where('created_at', '>=', now()->startOfWeek())->count(),
        ];

        // Obtener wallpapers recientes con información de favoritos
        $wallpapers = Wallpaper::with(['category', 'user'])
            ->latest()
            ->limit(12)
            ->get()
            ->map(function ($wallpaper) use ($user) {
                $isFavorited = $user ? Favorite::where('user_id', $user->id)
                    ->where('wallpaper_id', $wallpaper->id)
                    ->exists() : false;

                return [
                    'id' => $wallpaper->id,
                    'title' => $wallpaper->title,
                    'description' => $wallpaper->description,
                    'file_path' => str_starts_with($wallpaper->file_path, 'http')
                        ? $wallpaper->file_path
                        : Storage::url($wallpaper->file_path),
                    'category' => $wallpaper->category->name ?? 'Sin categoría',
                    'downloads_count' => $wallpaper->downloads_count,
                    'views_count' => $wallpaper->views_count ?? 0,
                    'created_at' => $wallpaper->created_at->format('Y-m-d'),
                    'is_featured' => $wallpaper->is_featured,
                    'is_active' => $wallpaper->is_active,
                    'is_premium' => $wallpaper->is_premium,
                    'is_favorited' => $isFavorited,
                    'user' => $wallpaper->user ? ['name' => $wallpaper->user->name] : null,
                ];
            });

        // Obtener categorías activas con estadísticas detalladas
        $categories = Category::where('is_active', true)
            ->withCount('wallpapers')
            ->orderBy('wallpapers_count', 'desc')
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'wallpaper_count' => $category->wallpapers_count,
                    'total_downloads' => $category->wallpapers()->sum('downloads_count'),
                    'image_url' => $category->image_path
                        ? Storage::url($category->image_path)
                        : $this->getCategoryDefaultImage($category->slug),
                ];
            });

        // Obtener analíticas para el resumen
        $analytics = [
            'downloads_by_category' => Category::withCount(['wallpapers as total_downloads' => function ($query) {
                $query->selectRaw('SUM(downloads_count) as total')
                    ->from('wallpapers')
                    ->whereColumn('wallpapers.category_id', 'categories.id');
            }])
                ->where('is_active', true)
                ->orderBy('total_downloads', 'desc')
                ->take(5)
                ->get()
                ->map(function ($category) {
                    return [
                        'name' => $category->name,
                        'downloads' => $category->total_downloads ?? 0,
                    ];
                }),
            'popular_wallpapers' => Wallpaper::orderBy('downloads_count', 'desc')
                ->take(5)
                ->get()
                ->map(function ($wallpaper) {
                    return [
                        'title' => $wallpaper->title,
                        'downloads_count' => $wallpaper->downloads_count,
                        'file_path' => $wallpaper->image_url, // Usar la URL completa en lugar de file_path
                    ];
                }),
            'uploads_by_month' => Wallpaper::selectRaw("strftime('%m', created_at) as month, COUNT(*) as count")
                ->whereRaw("strftime('%Y', created_at) = ?", [now()->year])
                ->groupByRaw("strftime('%m', created_at)")
                ->get(),
        ];

        return Inertia::render('dashboard', [
            'auth' => [
                'user' => $user->load('roles'),
                'role' => $user->getRoleDisplayName(),
                'is_admin' => $user->isAdmin(),
            ],
            'stats' => $stats,
            'wallpapers' => $wallpapers,
            'categories' => $categories,
            'analytics' => $analytics,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'nullable|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'files' => 'required|array|min:1|max:20', // Máximo 20 archivos
            'files.*' => 'file|mimes:jpeg,png,jpg,webp|max:20480', // 20MB máximo
        ]);

        $uploadedFiles = [];

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                try {
                    // Obtener dimensiones de la imagen
                    $imageSize = getimagesize($file->path());
                    if (!$imageSize) {
                        // Si no se puede obtener el tamaño, usar valores por defecto
                        $width = 1920;
                        $height = 1080;
                    } else {
                        $width = $imageSize[0];
                        $height = $imageSize[1];
                    }

                    // Generar nombre único
                    $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();

                    // Guardar imagen original
                    $path = $file->storeAs('wallpapers', $filename, 'public');

                    // Usar título del archivo si no se proporciona título
                    $title = $request->title ?: pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);

                    // Crear registro en BD
                    $wallpaper = Wallpaper::create([
                        'title' => $title,
                        'description' => null, // Sin descripción
                        'file_path' => $path,
                        'thumbnail_path' => $path, // Usar imagen original como thumbnail
                        'category_id' => $request->category_id,
                        'tags' => null, // Sin tags
                        'file_size' => $file->getSize(),
                        'resolution' => $width . 'x' . $height,
                        'is_featured' => false, // Sin destacar
                        'is_active' => true, // Siempre activo
                        'is_premium' => false, // No premium por defecto
                        'user_id' => Auth::id(),
                    ]);

                    $uploadedFiles[] = $wallpaper;
                } catch (\Exception $e) {
                    return back()->withErrors(['files' => 'Error al procesar la imagen: ' . $e->getMessage()]);
                }
            }
        }

        return back()->with('success', count($uploadedFiles) . ' wallpaper(s) subido(s) exitosamente.');
    }

    public function destroy(Wallpaper $wallpaper)
    {
        // Eliminar archivos del storage
        Storage::disk('public')->delete($wallpaper->file_path);
        if ($wallpaper->thumbnail_path) {
            Storage::disk('public')->delete($wallpaper->thumbnail_path);
        }

        // Eliminar registro
        $wallpaper->delete();

        return back()->with('success', 'Wallpaper eliminado exitosamente.');
    }

    public function update(Request $request, Wallpaper $wallpaper)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'category_id' => 'required|exists:categories,id',
            'tags' => 'nullable|string',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $wallpaper->update($request->all());

        return back()->with('success', 'Wallpaper actualizado exitosamente.');
    }

    // Método para crear categorías (mejorado)
    public function storeCategory(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255|unique:categories',
                'description' => 'nullable|string|max:500',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', // 2MB máximo
            ]);

            $data = [
                'name' => $request->name,
                'slug' => Str::slug($request->name),
                'description' => $request->description,
                'is_active' => true,
            ];

            // Manejar imagen si se proporciona
            if ($request->hasFile('image')) {
                $file = $request->file('image');

                // Verificar que el archivo sea válido
                if (!$file->isValid()) {
                    return back()->withErrors(['image' => 'El archivo de imagen no es válido.']);
                }

                $imageName = 'category_' . time() . '.' . $file->getClientOriginalExtension();

                // Intentar guardar la imagen
                try {
                    $data['image_path'] = $file->storeAs('categories', $imageName, 'public');
                } catch (\Exception $e) {
                    return back()->withErrors(['image' => 'Error al guardar la imagen: ' . $e->getMessage()]);
                }
            }

            Category::create($data);

            return redirect()->route('dashboard')->with('success', 'Categoría creada exitosamente.');
        } catch (\Exception $e) {
            return back()->withErrors(['general' => 'Error al crear la categoría: ' . $e->getMessage()]);
        }
    }

    // Método para obtener categorías detalladas para el dashboard
    public function getCategories()
    {
        $categories = Category::withCount('wallpapers')
            ->orderBy('wallpapers_count', 'desc')
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'description' => $category->description,
                    'image_path' => $category->image_path,
                    'image_url' => $category->image_path
                        ? Storage::url($category->image_path)
                        : $this->getCategoryDefaultImage($category->slug),
                    'is_active' => $category->is_active,
                    'wallpapers_count' => $category->wallpapers_count,
                    'total_downloads' => $category->wallpapers()->sum('downloads_count'),
                    'created_at' => $category->created_at->format('Y-m-d H:i:s'),
                ];
            });

        return response()->json($categories);
    }

    // Método auxiliar para imagen por defecto
    private function getCategoryDefaultImage(string $slug): string
    {
        $defaultImages = [
            'nature' => '/images/categories/nature.jpg',
            'abstract' => '/images/categories/abstract.jpg',
            'animals' => '/images/categories/animals.jpg',
            'cars' => '/images/categories/cars.jpg',
            'space' => '/images/categories/space.jpg',
            'sports' => '/images/categories/sports.jpg',
            'technology' => '/images/categories/technology.jpg',
            'architecture' => '/images/categories/architecture.jpg',
        ];

        return $defaultImages[$slug] ?? '/images/categories/default.jpg';
    }

    // Método para obtener analíticas
    public function analytics()
    {
        $analytics = [
            'downloads_by_category' => Category::withSum('wallpapers', 'downloads_count')
                ->get()
                ->map(function ($category) {
                    return [
                        'name' => $category->name,
                        'downloads' => $category->wallpapers_sum_downloads_count ?? 0,
                    ];
                }),
            'popular_wallpapers' => Wallpaper::orderBy('downloads_count', 'desc')
                ->limit(10)
                ->get()
                ->map(function ($wallpaper) {
                    return [
                        'title' => $wallpaper->title,
                        'downloads_count' => $wallpaper->downloads_count,
                        'file_path' => $wallpaper->image_url, // Usar la URL completa
                    ];
                }),
            'uploads_by_month' => Wallpaper::selectRaw("strftime('%m', created_at) as month, COUNT(*) as count")
                ->whereRaw("strftime('%Y', created_at) = ?", [now()->year])
                ->groupByRaw("strftime('%m', created_at)")
                ->get(),
        ];

        return response()->json($analytics);
    }

    /**
     * Obtener wallpapers favoritos del usuario
     */
    public function getFavorites()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }

        try {
            $favorites = Favorite::where('user_id', $user->id)
                ->with(['wallpaper.category', 'wallpaper.user'])
                ->get()
                ->map(function ($favorite) {
                    $wallpaper = $favorite->wallpaper;
                    if (!$wallpaper) {
                        return null;
                    }

                    return [
                        'id' => $wallpaper->id,
                        'title' => $wallpaper->title,
                        'description' => $wallpaper->description,
                        'file_path' => str_starts_with($wallpaper->file_path, 'http')
                            ? $wallpaper->file_path
                            : Storage::url($wallpaper->file_path),
                        'category' => $wallpaper->category?->name ?? 'Sin categoría',
                        'downloads_count' => $wallpaper->downloads_count,
                        'views_count' => $wallpaper->views_count ?? 0,
                        'created_at' => $wallpaper->created_at->format('Y-m-d'),
                        'is_featured' => $wallpaper->is_featured,
                        'is_active' => $wallpaper->is_active,
                        'is_premium' => $wallpaper->is_premium,
                        'is_favorited' => true,
                        'user' => $wallpaper->user ? ['name' => $wallpaper->user->name] : null,
                    ];
                })
                ->filter()
                ->values();

            return response()->json([
                'favorites' => $favorites,
                'total' => $favorites->count(),
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
