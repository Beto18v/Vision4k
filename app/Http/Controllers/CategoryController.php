<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Wallpaper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Category::where('is_active', true)
            ->withCount('wallpapers')
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'description' => $category->description,
                    'image' => Storage::url($category->image),
                    'wallpapers_count' => $category->wallpapers_count,
                ];
            });

        return Inertia::render('Categories/Index', [
            'categories' => $categories
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
    public function show(Category $category, Request $request)
    {
        $query = Wallpaper::with(['category', 'user'])
            ->where('category_id', $category->id)
            ->where('is_active', true);

        // Filtros
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'LIKE', "%{$search}%")
                    ->orWhere('description', 'LIKE', "%{$search}%")
                    ->orWhere('tags', 'LIKE', "%{$search}%");
            });
        }

        if ($request->has('featured') && $request->featured) {
            $query->where('is_featured', true);
        }

        // Ordenamiento
        $sortBy = $request->get('sort', 'newest');
        switch ($sortBy) {
            case 'popular':
                $query->orderBy('downloads_count', 'desc');
                break;
            case 'name':
                $query->orderBy('title', 'asc');
                break;
            case 'newest':
            default:
                $query->latest();
                break;
        }

        $wallpapers = $query->paginate(20)->through(function ($wallpaper) {
            return [
                'id' => $wallpaper->id,
                'title' => $wallpaper->title,
                'description' => $wallpaper->description,
                'url' => Storage::url($wallpaper->file_path),
                'thumbnail' => Storage::url($wallpaper->thumbnail_path),
                'category' => $wallpaper->category->name ?? 'Sin categoría',
                'tags' => $wallpaper->tags ? explode(',', $wallpaper->tags) : [],
                'downloads_count' => $wallpaper->downloads_count,
                'views_count' => $wallpaper->views_count ?? 0,
                'is_featured' => $wallpaper->is_featured,
                'is_premium' => $wallpaper->is_premium,
                'resolution' => $wallpaper->resolution,
                'file_size' => $wallpaper->file_size,
                'created_at' => $wallpaper->created_at->format('Y-m-d'),
                'is_favorited' => Auth::check() ? $wallpaper->favorites()->where('user_id', Auth::id())->exists() : false,
            ];
        });

        return Inertia::render('Categories/Show', [
            'category' => [
                'id' => $category->id,
                'name' => $category->name,
                'description' => $category->description,
                'image' => Storage::url($category->image),
            ],
            'wallpapers' => $wallpapers,
            'filters' => $request->only(['search', 'sort', 'featured']),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        //
    }
}
