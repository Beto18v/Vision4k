<?php

/**
 * Controlador Category - Gestiona categorías de wallpapers en Vision4K
 *
 * Funcionalidades: CRUD de categorías, búsqueda, filtrado, gestión de imágenes
 * Métodos: index(), create(), store(), show(), edit(), update(), destroy()
 * Características: validación de slugs únicos, manejo de imágenes de portada
 */

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Wallpaper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Category::query();

        // Filtros
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        // Ordenamiento
        $sortBy = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');

        $query->orderBy($sortBy, $sortDirection);

        $categories = $query->withCount('wallpapers')
            ->paginate(15)
            ->through(function ($category) {
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
                    'updated_at' => $category->updated_at->format('Y-m-d H:i:s'),
                ];
            });

        // Estadísticas generales
        $stats = [
            'total_categories' => Category::count(),
            'active_categories' => Category::where('is_active', true)->count(),
            'inactive_categories' => Category::where('is_active', false)->count(),
            'total_wallpapers' => Wallpaper::count(),
        ];

        return Inertia::render('categories/index', [
            'categories' => $categories,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status', 'sort', 'direction']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('categories/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories',
            'description' => 'nullable|string|max:1000',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', // 2MB máximo
            'is_active' => 'boolean',
        ]);

        $data = [
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'is_active' => $request->boolean('is_active', true),
        ];

        // Manejar imagen si se proporciona
        if ($request->hasFile('image')) {
            $imageName = 'category_' . time() . '.' . $request->file('image')->getClientOriginalExtension();
            $data['image_path'] = $request->file('image')->storeAs('categories', $imageName, 'public');
        }

        $category = Category::create($data);

        return redirect()->route('categories.index')
            ->with('success', 'Categoría creada exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        $category->loadCount('wallpapers');

        // Obtener wallpapers de esta categoría
        $wallpapers = $category->wallpapers()
            ->with('user')
            ->latest()
            ->paginate(12)
            ->through(function ($wallpaper) {
                return [
                    'id' => $wallpaper->id,
                    'title' => $wallpaper->title,
                    'description' => $wallpaper->description,
                    'file_path' => str_starts_with($wallpaper->file_path, 'http')
                        ? $wallpaper->file_path
                        : Storage::url($wallpaper->file_path),
                    'thumbnail_path' => $wallpaper->thumbnail_path
                        ? Storage::url($wallpaper->thumbnail_path)
                        : Storage::url($wallpaper->file_path),
                    'downloads_count' => $wallpaper->downloads_count,
                    'views_count' => $wallpaper->views_count,
                    'is_featured' => $wallpaper->is_featured,
                    'is_active' => $wallpaper->is_active,
                    'is_premium' => $wallpaper->is_premium,
                    'created_at' => $wallpaper->created_at->format('Y-m-d'),
                    'user' => $wallpaper->user ? [
                        'name' => $wallpaper->user->name,
                    ] : null,
                ];
            });

        return Inertia::render('categories/show', [
            'category' => [
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
                'updated_at' => $category->updated_at->format('Y-m-d H:i:s'),
            ],
            'wallpapers' => $wallpapers,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        return Inertia::render('categories/edit', [
            'category' => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'image_path' => $category->image_path,
                'image_url' => $category->image_path
                    ? Storage::url($category->image_path)
                    : $this->getCategoryDefaultImage($category->slug),
                'is_active' => $category->is_active,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('categories')->ignore($category->id)],
            'description' => 'nullable|string|max:1000',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'is_active' => 'boolean',
        ]);

        $data = [
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'is_active' => $request->boolean('is_active'),
        ];

        // Manejar imagen si se proporciona
        if ($request->hasFile('image')) {
            // Eliminar imagen anterior si existe
            if ($category->image_path) {
                Storage::disk('public')->delete($category->image_path);
            }

            $imageName = 'category_' . time() . '.' . $request->file('image')->getClientOriginalExtension();
            $data['image_path'] = $request->file('image')->storeAs('categories', $imageName, 'public');
        }

        $category->update($data);

        return redirect()->route('categories.index')
            ->with('success', 'Categoría actualizada exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        // Verificar si la categoría tiene wallpapers asociados
        if ($category->wallpapers()->count() > 0) {
            return back()->withErrors([
                'category' => 'No se puede eliminar la categoría porque tiene wallpapers asociados.'
            ]);
        }

        // Eliminar imagen si existe
        if ($category->image_path) {
            Storage::disk('public')->delete($category->image_path);
        }

        $category->delete();

        return redirect()->route('categories.index')
            ->with('success', 'Categoría eliminada exitosamente.');
    }

    /**
     * Toggle category active status.
     */
    public function toggle(Category $category)
    {
        $category->update([
            'is_active' => !$category->is_active,
        ]);

        $status = $category->is_active ? 'activada' : 'desactivada';

        return back()->with('success', "Categoría {$status} exitosamente.");
    }

    /**
     * Get default category image based on slug.
     */
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
}
