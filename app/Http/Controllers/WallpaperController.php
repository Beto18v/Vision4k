<?php

/**
 * Controlador Wallpaper - Gestiona wallpapers en Vision4K
 *
 * Funcionalidades: CRUD de wallpapers, descargas, favoritos, búsqueda, filtrado
 * Métodos: index(), create(), store(), show(), edit(), update(), destroy(), download()
 * Características: manejo de archivos, thumbnails, estadísticas de descargas/vistas
 */

namespace App\Http\Controllers;

use App\Models\Wallpaper;
use App\Models\Category;
use App\Models\Download;
use App\Models\Favorite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class WallpaperController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Wallpaper::with(['category', 'user'])
            ->where('is_active', true);

        // Filtros
        if ($request->category) {
            $query->where('category_id', $request->category);
        }

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('tags', 'like', "%{$search}%");
            });
        }

        // Ordenamiento
        switch ($request->sort) {
            case 'popular':
                $query->orderBy('downloads_count', 'desc');
                break;
            case 'newest':
                $query->orderBy('created_at', 'desc');
                break;
            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
        }

        $wallpapers = $query->paginate(12)
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
                    'category' => $wallpaper->category->name ?? 'Sin categoría',
                    'tags' => $wallpaper->tags ? explode(',', trim($wallpaper->tags)) : [],
                    'downloads_count' => $wallpaper->downloads_count,
                    'views_count' => $wallpaper->views_count ?? 0,
                    'is_featured' => $wallpaper->is_featured,
                    'is_premium' => $wallpaper->is_premium,
                    'created_at' => $wallpaper->created_at->format('Y-m-d'),
                    'user' => $wallpaper->user ? [
                        'name' => $wallpaper->user->name,
                    ] : null,
                ];
            });

        // Obtener categorías para el filtro
        $categories = Category::where('is_active', true)
            ->withCount('wallpapers')
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'wallpapers_count' => $category->wallpapers_count,
                ];
            });

        return Inertia::render('wallpapers/index', [
            'wallpapers' => $wallpapers,
            'categories' => $categories,
            'filters' => $request->only(['category', 'search', 'sort']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Wallpaper $wallpaper)
    {
        // Incrementar contador de vistas
        $wallpaper->increment('views_count');

        $wallpaper->load(['category', 'user']);

        // Obtener wallpapers relacionados
        $relatedWallpapers = Wallpaper::with('category')
            ->where('category_id', $wallpaper->category_id)
            ->where('id', '!=', $wallpaper->id)
            ->where('is_active', true)
            ->limit(6)
            ->get()
            ->map(function ($related) {
                return [
                    'id' => $related->id,
                    'title' => $related->title,
                    'file_path' => str_starts_with($related->file_path, 'http')
                        ? $related->file_path
                        : Storage::url($related->file_path),
                    'thumbnail_path' => $related->thumbnail_path
                        ? Storage::url($related->thumbnail_path)
                        : Storage::url($related->file_path),
                    'category' => $related->category->name ?? 'Sin categoría',
                ];
            });

        return Inertia::render('wallpapers/show', [
            'wallpaper' => [
                'id' => $wallpaper->id,
                'title' => $wallpaper->title,
                'description' => $wallpaper->description,
                'file_path' => str_starts_with($wallpaper->file_path, 'http')
                    ? $wallpaper->file_path
                    : Storage::url($wallpaper->file_path),
                'thumbnail_path' => $wallpaper->thumbnail_path
                    ? Storage::url($wallpaper->thumbnail_path)
                    : Storage::url($wallpaper->file_path),
                'category' => $wallpaper->category ? [
                    'id' => $wallpaper->category->id,
                    'name' => $wallpaper->category->name,
                ] : null,
                'tags' => $wallpaper->tags ? explode(',', trim($wallpaper->tags)) : [],
                'downloads_count' => $wallpaper->downloads_count,
                'views_count' => $wallpaper->views_count,
                'is_featured' => $wallpaper->is_featured,
                'is_premium' => $wallpaper->is_premium,
                'file_size' => $wallpaper->file_size,
                'resolution' => $wallpaper->resolution,
                'created_at' => $wallpaper->created_at->format('Y-m-d H:i:s'),
                'user' => $wallpaper->user ? [
                    'name' => $wallpaper->user->name,
                ] : null,
            ],
            'relatedWallpapers' => $relatedWallpapers,
            'isFavorited' => Auth::check() ? Favorite::where('user_id', Auth::id())
                ->where('wallpaper_id', $wallpaper->id)
                ->exists() : false,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    /**
     * Download wallpaper
     */
    public function download(Wallpaper $wallpaper)
    {
        // Verificar si el usuario puede descargar (premium check)
        if ($wallpaper->is_premium && (!Auth::check() || !Auth::user()->is_premium)) {
            return redirect()->back()->withErrors([
                'premium' => 'Este wallpaper es premium. Actualiza tu cuenta para descargarlo.'
            ]);
        }

        // Registrar la descarga
        if (Auth::check()) {
            Download::create([
                'user_id' => Auth::id(),
                'wallpaper_id' => $wallpaper->id,
                'ip_address' => request()->ip(),
            ]);
        }

        // Incrementar contador de descargas
        $wallpaper->increment('downloads_count');

        // Si es una URL externa, redirigir
        if (str_starts_with($wallpaper->file_path, 'http')) {
            return redirect($wallpaper->file_path);
        }

        // Descargar archivo local
        return Storage::disk('public')->download($wallpaper->file_path, $wallpaper->title . '.jpg');
    }

    /**
     * Get trending wallpapers
     */
    public function trending()
    {
        $wallpapers = Wallpaper::with('category')
            ->where('is_active', true)
            ->orderBy('downloads_count', 'desc')
            ->limit(12)
            ->get()
            ->map(function ($wallpaper) {
                return [
                    'id' => $wallpaper->id,
                    'title' => $wallpaper->title,
                    'file_path' => str_starts_with($wallpaper->file_path, 'http')
                        ? $wallpaper->file_path
                        : Storage::url($wallpaper->file_path),
                    'thumbnail_path' => $wallpaper->thumbnail_path
                        ? Storage::url($wallpaper->thumbnail_path)
                        : Storage::url($wallpaper->file_path),
                    'category' => $wallpaper->category->name ?? 'Sin categoría',
                    'downloads_count' => $wallpaper->downloads_count,
                    'is_premium' => $wallpaper->is_premium,
                ];
            });

        return Inertia::render('wallpapers/trending', [
            'wallpapers' => $wallpapers,
        ]);
    }

    /**
     * Get premium wallpapers
     */
    public function premium()
    {
        $wallpapers = Wallpaper::with('category')
            ->where('is_active', true)
            ->where('is_premium', true)
            ->latest()
            ->paginate(12)
            ->through(function ($wallpaper) {
                return [
                    'id' => $wallpaper->id,
                    'title' => $wallpaper->title,
                    'file_path' => str_starts_with($wallpaper->file_path, 'http')
                        ? $wallpaper->file_path
                        : Storage::url($wallpaper->file_path),
                    'thumbnail_path' => $wallpaper->thumbnail_path
                        ? Storage::url($wallpaper->thumbnail_path)
                        : Storage::url($wallpaper->file_path),
                    'category' => $wallpaper->category->name ?? 'Sin categoría',
                    'downloads_count' => $wallpaper->downloads_count,
                    'is_premium' => $wallpaper->is_premium,
                ];
            });

        return Inertia::render('wallpapers/premium', [
            'wallpapers' => $wallpapers,
        ]);
    }

    /**
     * Toggle favorite status
     */
    public function toggleFavorite(Wallpaper $wallpaper)
    {
        $user = Auth::user();

        $favorite = Favorite::where('user_id', $user->id)
            ->where('wallpaper_id', $wallpaper->id)
            ->first();

        if ($favorite) {
            $favorite->delete();
            $isFavorited = false;
        } else {
            Favorite::create([
                'user_id' => $user->id,
                'wallpaper_id' => $wallpaper->id,
            ]);
            $isFavorited = true;
        }

        return response()->json([
            'is_favorited' => $isFavorited,
        ]);
    }
}
