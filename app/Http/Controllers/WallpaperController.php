<?php

namespace App\Http\Controllers;

use App\Models\Wallpaper;
use App\Models\Category;
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

        $wallpapers = $query->paginate(24)->through(function ($wallpaper) {
            return [
                'id' => $wallpaper->id,
                'title' => $wallpaper->title,
                'description' => $wallpaper->description,
                'url' => str_starts_with($wallpaper->file_path, 'http')
                    ? $wallpaper->file_path
                    : Storage::url($wallpaper->file_path),
                'thumbnail' => $wallpaper->thumbnail_path
                    ? (str_starts_with($wallpaper->thumbnail_path, 'http')
                        ? $wallpaper->thumbnail_path
                        : Storage::url($wallpaper->thumbnail_path))
                    : (str_starts_with($wallpaper->file_path, 'http')
                        ? $wallpaper->file_path
                        : Storage::url($wallpaper->file_path)),
                'category' => $wallpaper->category->name ?? 'General',
                'tags' => $wallpaper->tags ? explode(',', trim($wallpaper->tags)) : [],
                'downloads_count' => $wallpaper->downloads_count,
                'views_count' => $wallpaper->views_count,
                'is_premium' => $wallpaper->is_premium,
                'is_featured' => $wallpaper->is_featured,
                'created_at' => $wallpaper->created_at->format('Y-m-d'),
                'user' => [
                    'name' => $wallpaper->user->name ?? 'Anonymous',
                ],
            ];
        });

        $categories = Category::where('is_active', true)->get();

        return Inertia::render('Wallpapers/Index', [
            'wallpapers' => $wallpapers,
            'categories' => $categories,
            'filters' => [
                'search' => $request->search,
                'category' => $request->category,
                'sort' => $request->sort,
            ]
        ]);
    }

    /**
     * Display trending wallpapers.
     */
    public function trending(Request $request)
    {
        $days = $request->get('days', 7); // Por defecto últimos 7 días

        $wallpapers = Wallpaper::with(['category', 'user'])
            ->where('is_active', true)
            ->where('created_at', '>=', now()->subDays($days))
            ->orderByRaw('(downloads_count + views_count) DESC')
            ->paginate(24)
            ->through(function ($wallpaper) {
                return [
                    'id' => $wallpaper->id,
                    'title' => $wallpaper->title,
                    'description' => $wallpaper->description,
                    'url' => Storage::url($wallpaper->file_path),
                    'thumbnail' => Storage::url($wallpaper->thumbnail_path ?? $wallpaper->file_path),
                    'category' => $wallpaper->category->name ?? 'General',
                    'tags' => $wallpaper->tags ? explode(',', trim($wallpaper->tags)) : [],
                    'downloads_count' => $wallpaper->downloads_count,
                    'views_count' => $wallpaper->views_count,
                    'is_premium' => $wallpaper->is_premium,
                    'is_featured' => $wallpaper->is_featured,
                    'created_at' => $wallpaper->created_at->format('Y-m-d'),
                    'user' => [
                        'name' => $wallpaper->user->name ?? 'Anonymous',
                    ],
                ];
            });

        return Inertia::render('Trending', [
            'wallpapers' => $wallpapers,
            'categories' => Category::where('is_active', true)->get(),
            'days' => $days,
        ]);
    }

    /**
     * Display premium wallpapers.
     */
    public function premium(Request $request)
    {
        $wallpapers = Wallpaper::with(['category', 'user'])
            ->where('is_active', true)
            ->where('is_premium', true)
            ->orderBy('created_at', 'desc')
            ->paginate(24)
            ->through(function ($wallpaper) {
                return [
                    'id' => $wallpaper->id,
                    'title' => $wallpaper->title,
                    'description' => $wallpaper->description,
                    'url' => Storage::url($wallpaper->file_path),
                    'thumbnail' => Storage::url($wallpaper->thumbnail_path ?? $wallpaper->file_path),
                    'category' => $wallpaper->category->name ?? 'General',
                    'tags' => $wallpaper->tags ? explode(',', trim($wallpaper->tags)) : [],
                    'downloads_count' => $wallpaper->downloads_count,
                    'views_count' => $wallpaper->views_count,
                    'is_premium' => $wallpaper->is_premium,
                    'is_featured' => $wallpaper->is_featured,
                    'created_at' => $wallpaper->created_at->format('Y-m-d'),
                    'user' => [
                        'name' => $wallpaper->user->name ?? 'Anonymous',
                    ],
                ];
            });

        return Inertia::render('Premium', [
            'wallpapers' => $wallpapers,
            'categories' => Category::where('is_active', true)->get(),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Wallpaper $wallpaper)
    {
        $wallpaper->load(['category', 'user']);

        // Incrementar vistas
        $wallpaper->increment('views_count');

        // Wallpapers relacionados
        $relatedWallpapers = Wallpaper::where('category_id', $wallpaper->category_id)
            ->where('id', '!=', $wallpaper->id)
            ->where('is_active', true)
            ->limit(6)
            ->get()
            ->map(function ($w) {
                return [
                    'id' => $w->id,
                    'title' => $w->title,
                    'url' => Storage::url($w->file_path),
                    'thumbnail' => Storage::url($w->thumbnail_path ?? $w->file_path),
                ];
            });

        return Inertia::render('Wallpapers/Show', [
            'wallpaper' => [
                'id' => $wallpaper->id,
                'title' => $wallpaper->title,
                'description' => $wallpaper->description,
                'url' => Storage::url($wallpaper->file_path),
                'thumbnail' => Storage::url($wallpaper->thumbnail_path ?? $wallpaper->file_path),
                'category' => $wallpaper->category->name ?? 'General',
                'tags' => $wallpaper->tags ? explode(',', trim($wallpaper->tags)) : [],
                'downloads_count' => $wallpaper->downloads_count,
                'views_count' => $wallpaper->views_count,
                'is_premium' => $wallpaper->is_premium,
                'is_featured' => $wallpaper->is_featured,
                'file_size' => $wallpaper->file_size,
                'resolution' => $wallpaper->resolution,
                'created_at' => $wallpaper->created_at->format('Y-m-d'),
                'user' => [
                    'name' => $wallpaper->user->name ?? 'Anonymous',
                ],
            ],
            'relatedWallpapers' => $relatedWallpapers,
        ]);
    }

    /**
     * Download wallpaper
     */
    public function download(Wallpaper $wallpaper)
    {
        if (!$wallpaper->is_active) {
            abort(404);
        }

        // Incrementar contador de descargas
        $wallpaper->increment('downloads_count');

        // Registrar descarga si el usuario está autenticado
        if (auth()->check()) {
            $wallpaper->downloads()->create([
                'user_id' => auth()->id(),
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);
        }

        $filename = $wallpaper->title . '_' . $wallpaper->resolution . '.' . pathinfo($wallpaper->file_path, PATHINFO_EXTENSION);

        // Si es una URL externa, redirigir
        if (str_starts_with($wallpaper->file_path, 'http')) {
            return redirect($wallpaper->file_path);
        }

        // Si es un archivo local
        $filePath = storage_path('app/public/' . $wallpaper->file_path);

        if (!file_exists($filePath)) {
            abort(404, 'File not found');
        }

        return response()->download($filePath, $filename);
    }

    /**
     * Toggle favorite
     */
    public function toggleFavorite(Request $request, Wallpaper $wallpaper)
    {
        $user = $request->user();

        if ($user->favorites()->where('wallpaper_id', $wallpaper->id)->exists()) {
            $user->favorites()->detach($wallpaper->id);
            $action = 'removed';
        } else {
            $user->favorites()->attach($wallpaper->id);
            $action = 'added';
        }

        return response()->json([
            'action' => $action,
            'is_favorite' => $action === 'added',
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
}
