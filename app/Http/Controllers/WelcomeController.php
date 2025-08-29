<?php

namespace App\Http\Controllers;

use App\Models\Wallpaper;
use App\Models\Category;
use App\Models\Favorite;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Obtener wallpapers destacados y recientes
        $wallpapers = Wallpaper::with('category')
            ->where('is_active', true)
            ->latest()
            ->limit(12)
            ->get()
            ->map(function ($wallpaper) use ($user) {
                $isFavorited = $user ? Favorite::where('user_id', $user->id)
                    ->where('wallpaper_id', $wallpaper->id)
                    ->exists() : false;

                return [
                    'id' => $wallpaper->id,
                    'url' => str_starts_with($wallpaper->file_path, 'http')
                        ? $wallpaper->file_path
                        : Storage::url($wallpaper->file_path),
                    'description' => $wallpaper->title,
                    'category' => strtolower($wallpaper->category->name ?? 'general'),
                    'tags' => $wallpaper->tags ? explode(',', trim($wallpaper->tags)) : [],
                    'downloads_count' => $wallpaper->downloads_count,
                    'is_premium' => $wallpaper->is_premium,
                    'is_favorited' => $isFavorited,
                ];
            });

        // Obtener categorías activas
        $categories = Category::where('is_active', true)
            ->withCount('wallpapers')
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'image' => $category->image_path
                        ? Storage::url($category->image_path)
                        : $this->getCategoryDefaultImage($category->slug),
                    'wallpaper_count' => $category->wallpapers_count,
                ];
            });

        // Si no hay wallpapers, crear algunos de ejemplo
        if ($wallpapers->isEmpty()) {
            $wallpapers = $this->getDefaultWallpapers();
        }

        // Si no hay categorías, crear algunas de ejemplo
        if ($categories->isEmpty()) {
            $categories = $this->getDefaultCategories();
        }

        return Inertia::render('welcome', [
            'wallpapers' => $wallpapers,
            'categories' => $categories,
        ]);
    }

    private function getCategoryDefaultImage($slug)
    {
        $defaultImages = [
            'naturaleza' => 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'fantasia' => 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'anime' => 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        ];

        return $defaultImages[$slug] ?? 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    }

    private function getDefaultWallpapers()
    {
        return collect([
            [
                'id' => 1,
                'url' => 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
                'description' => 'Montañas al amanecer en 4K',
                'category' => 'naturaleza',
                'tags' => ['mountains', 'sunrise', 'landscape', 'nature'],
                'downloads_count' => 0,
                'is_premium' => false,
                'is_favorited' => false,
            ],
            [
                'id' => 2,
                'url' => 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
                'description' => 'Océano cristalino',
                'category' => 'naturaleza',
                'tags' => ['ocean', 'beach', 'water', 'blue'],
                'downloads_count' => 0,
                'is_premium' => false,
                'is_favorited' => false,
            ],
            [
                'id' => 3,
                'url' => 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
                'description' => 'Ciudad nocturna futurista',
                'category' => 'urbano',
                'tags' => ['city', 'night', 'lights', 'urban'],
                'downloads_count' => 0,
                'is_premium' => false,
                'is_favorited' => false,
            ],
        ]);
    }

    private function getDefaultCategories()
    {
        return collect([
            [
                'id' => 1,
                'name' => 'Naturaleza',
                'image' => 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'wallpaper_count' => 0,
            ],
            [
                'id' => 2,
                'name' => 'Fantasia',
                'image' => 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'wallpaper_count' => 0,
            ],
            [
                'id' => 3,
                'name' => 'Anime',
                'image' => 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'wallpaper_count' => 0,
            ],
        ]);
    }
}
