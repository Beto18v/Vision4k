<?php

namespace App\Console\Commands;

use App\Models\Category;
use App\Models\User;
use App\Models\Wallpaper;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class PopulateDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:populate {--force : Force populate even if data exists}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Populate the database with sample categories and wallpapers';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting database population...');

        // Check if data already exists
        if (!$this->option('force') && (Category::count() > 0 || Wallpaper::count() > 0)) {
            $this->warn('Database already contains data. Use --force to override.');
            return;
        }

        // Create admin user if not exists
        $user = User::firstOrCreate(
            ['email' => 'admin@vision4k.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        $this->info("Admin user created/found: {$user->email}");

        // Create categories
        $categories = [
            ['name' => 'Naturaleza', 'slug' => 'naturaleza', 'description' => 'Paisajes, plantas, animales y toda la belleza natural'],
            ['name' => 'Abstracto', 'slug' => 'abstracto', 'description' => 'Diseños únicos y patrones creativos'],
            ['name' => 'Tecnología', 'slug' => 'tecnologia', 'description' => 'Dispositivos, circuitos y diseños futuristas'],
            ['name' => 'Espacio', 'slug' => 'espacio', 'description' => 'Planetas, estrellas, galaxias y el cosmos'],
            ['name' => 'Minimalista', 'slug' => 'minimalista', 'description' => 'Diseños simples y elegantes'],
            ['name' => 'Gaming', 'slug' => 'gaming', 'description' => 'Videojuegos, personajes y escenas épicas'],
            ['name' => 'Urbano', 'slug' => 'urbano', 'description' => 'Ciudades, arquitectura y vida urbana'],
            ['name' => 'Arte', 'slug' => 'arte', 'description' => 'Pinturas, ilustraciones y obras artísticas'],
        ];

        foreach ($categories as $categoryData) {
            $categoryData['is_active'] = true;
            Category::firstOrCreate(
                ['slug' => $categoryData['slug']],
                $categoryData
            );
        }

        $this->info('Categories created successfully!');

        // Create sample wallpapers
        $wallpapers = [
            [
                'title' => 'Montañas al Amanecer',
                'description' => 'Hermoso paisaje montañoso con los primeros rayos del sol',
                'file_path' => 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=3840&q=80',
                'category_slug' => 'naturaleza',
                'tags' => 'montañas,amanecer,paisaje,naturaleza',
                'downloads_count' => 1250,
                'views_count' => 5420,
                'is_featured' => true,
            ],
            [
                'title' => 'Ondas Abstractas',
                'description' => 'Diseño abstracto con ondas en colores vibrantes',
                'file_path' => 'https://images.unsplash.com/photo-1551085254-c51a29bfbcd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=3840&q=80',
                'category_slug' => 'abstracto',
                'tags' => 'abstracto,ondas,colores,arte',
                'downloads_count' => 987,
                'views_count' => 3210,
                'is_featured' => false,
            ],
            [
                'title' => 'Nebulosa Espacial',
                'description' => 'Nebulosa colorida en el espacio profundo',
                'file_path' => 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=3840&q=80',
                'category_slug' => 'espacio',
                'tags' => 'espacio,nebulosa,estrellas,cosmos',
                'downloads_count' => 756,
                'views_count' => 2890,
                'is_featured' => true,
                'is_premium' => true,
            ],
            [
                'title' => 'Ciudad Futurista',
                'description' => 'Paisaje urbano con luces de neón y arquitectura futurista',
                'file_path' => 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=3840&q=80',
                'category_slug' => 'tecnologia',
                'tags' => 'ciudad,futurista,neón,tecnología',
                'downloads_count' => 543,
                'views_count' => 1890,
                'is_featured' => false,
            ],
            [
                'title' => 'Diseño Minimalista',
                'description' => 'Fondo limpio y minimalista para escritorio',
                'file_path' => 'https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&auto=format&fit=crop&w=3840&q=80',
                'category_slug' => 'minimalista',
                'tags' => 'minimalista,limpio,simple,moderno',
                'downloads_count' => 654,
                'views_count' => 2156,
                'is_featured' => false,
            ],
            [
                'title' => 'Gaming Setup RGB',
                'description' => 'Setup gaming épico con iluminación RGB',
                'file_path' => 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=3840&q=80',
                'category_slug' => 'gaming',
                'tags' => 'gaming,rgb,setup,videojuegos',
                'downloads_count' => 432,
                'views_count' => 1567,
                'is_featured' => false,
            ],
        ];

        foreach ($wallpapers as $wallpaperData) {
            $category = Category::where('slug', $wallpaperData['category_slug'])->first();
            if ($category) {
                $wallpaperData['category_id'] = $category->id;
                $wallpaperData['user_id'] = $user->id;
                $wallpaperData['resolution'] = '3840x2160';
                $wallpaperData['file_size'] = 2048000;
                $wallpaperData['is_active'] = true;
                $wallpaperData['is_premium'] = $wallpaperData['is_premium'] ?? false;

                unset($wallpaperData['category_slug']);

                Wallpaper::firstOrCreate(
                    ['title' => $wallpaperData['title']],
                    $wallpaperData
                );
            }
        }

        $this->info('Sample wallpapers created successfully!');
        $this->info('Database population completed!');
        $this->info('Admin credentials: admin@vision4k.com / password');
    }
}
