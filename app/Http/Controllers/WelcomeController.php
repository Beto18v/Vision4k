<?php

namespace App\Http\Controllers;

use App\Models\Wallpaper;
use App\Models\Category;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    public function index()
    {
        // Obtener wallpapers destacados y recientes
        $wallpapers = Wallpaper::with('category')
            ->where('is_active', true)
            ->latest()
            ->limit(12)
            ->get()
            ->map(function ($wallpaper) {
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
            'abstracto' => 'https://images.unsplash.com/photo-1551085254-c51a29bfbcd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'urbano' => 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'tecnologia' => 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'espacio' => 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'minimalista' => 'https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'gaming' => 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
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
            ],
            [
                'id' => 2,
                'url' => 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
                'description' => 'Océano cristalino',
                'category' => 'naturaleza',
                'tags' => ['ocean', 'beach', 'water', 'blue'],
                'downloads_count' => 0,
                'is_premium' => false,
            ],
            [
                'id' => 3,
                'url' => 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
                'description' => 'Ciudad nocturna futurista',
                'category' => 'urbano',
                'tags' => ['city', 'night', 'lights', 'urban'],
                'downloads_count' => 0,
                'is_premium' => false,
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
                'name' => 'Abstracto',
                'image' => 'https://images.unsplash.com/photo-1551085254-c51a29bfbcd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'wallpaper_count' => 0,
            ],
            [
                'id' => 3,
                'name' => 'Urbano',
                'image' => 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'wallpaper_count' => 0,
            ],
        ]);
    }
}
