<?php

namespace App\Http\Controllers;

use App\Models\Wallpaper;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Obtener estadísticas
        $stats = [
            'total_wallpapers' => Wallpaper::count(),
            'total_downloads' => Wallpaper::sum('downloads_count'),
            'total_categories' => Category::where('is_active', true)->count(),
            'recent_uploads' => Wallpaper::whereDate('created_at', today())->count(),
        ];

        // Obtener wallpapers recientes
        $wallpapers = Wallpaper::with('category')
            ->latest()
            ->limit(12)
            ->get()
            ->map(function ($wallpaper) {
                return [
                    'id' => $wallpaper->id,
                    'title' => $wallpaper->title,
                    'description' => $wallpaper->description,
                    'file_path' => Storage::url($wallpaper->file_path),
                    'category' => $wallpaper->category->name,
                    'tags' => $wallpaper->tags ? explode(',', $wallpaper->tags) : [],
                    'downloads_count' => $wallpaper->downloads_count,
                    'created_at' => $wallpaper->created_at->format('Y-m-d'),
                ];
            });

        // Obtener categorías con conteos
        $categories = Category::where('is_active', true)
            ->withCount('wallpapers')
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'wallpaper_count' => $category->wallpapers_count,
                ];
            });

        return Inertia::render('Dashboard', [
            'auth' => [
                'user' => $user
            ],
            'stats' => $stats,
            'wallpapers' => $wallpapers,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'category_id' => 'required|exists:categories,id',
            'tags' => 'nullable|string',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'files.*' => 'required|image|mimes:jpeg,png,jpg,webp|max:10240', // 10MB máximo
        ]);

        $uploadedFiles = [];

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                // Validar resolución mínima
                $imageSize = getimagesize($file->path());
                if ($imageSize[0] < 1920 || $imageSize[1] < 1080) {
                    return back()->withErrors(['files' => 'Las imágenes deben tener una resolución mínima de 1920x1080.']);
                }

                // Generar nombre único
                $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
                $thumbnailName = 'thumb_' . $filename;

                // Guardar imagen original
                $path = $file->storeAs('wallpapers', $filename, 'public');

                // Crear thumbnail optimizado
                $manager = new ImageManager(new Driver());
                $thumbnail = $manager->read($file)
                    ->cover(400, 250)
                    ->toWebp(80);

                Storage::disk('public')->put('wallpapers/thumbnails/' . $thumbnailName, $thumbnail);

                // Crear registro en BD
                $wallpaper = Wallpaper::create([
                    'title' => $request->title,
                    'description' => $request->description,
                    'file_path' => $path,
                    'thumbnail_path' => 'wallpapers/thumbnails/' . $thumbnailName,
                    'category_id' => $request->category_id,
                    'tags' => $request->tags,
                    'file_size' => $file->getSize(),
                    'resolution' => $imageSize[0] . 'x' . $imageSize[1],
                    'is_featured' => $request->boolean('is_featured'),
                    'is_active' => $request->boolean('is_active'),
                    'user_id' => Auth::id(),
                ]);

                $uploadedFiles[] = $wallpaper;
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

    // Método para crear categorías
    public function storeCategory(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories',
            'description' => 'nullable|string|max:500',
        ]);

        Category::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'is_active' => true,
        ]);

        return back()->with('success', 'Categoría creada exitosamente.');
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
                ->get(['title', 'downloads_count', 'file_path']),
            'uploads_by_month' => Wallpaper::selectRaw('MONTH(created_at) as month, COUNT(*) as count')
                ->whereYear('created_at', now()->year)
                ->groupBy('month')
                ->get(),
        ];

        return response()->json($analytics);
    }
}
