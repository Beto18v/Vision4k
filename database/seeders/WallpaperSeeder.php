<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Wallpaper;
use App\Models\User;
use Illuminate\Database\Seeder;

class WallpaperSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear categorías
        $categories = [
            [
                'name' => 'Naturaleza',
                'slug' => 'naturaleza',
                'description' => 'Paisajes, plantas, animales y toda la belleza natural',
            ],
            [
                'name' => 'Abstracto',
                'slug' => 'abstracto',
                'description' => 'Diseños únicos y patrones creativos',
            ],
            [
                'name' => 'Tecnología',
                'slug' => 'tecnologia',
                'description' => 'Dispositivos, circuitos y diseños futuristas',
            ],
            [
                'name' => 'Espacio',
                'slug' => 'espacio',
                'description' => 'Planetas, estrellas, galaxias y el cosmos',
            ],
            [
                'name' => 'Minimalista',
                'slug' => 'minimalista',
                'description' => 'Diseños simples y elegantes',
            ],
            [
                'name' => 'Gaming',
                'slug' => 'gaming',
                'description' => 'Videojuegos, personajes y escenas épicas',
            ],
            [
                'name' => 'Urbano',
                'slug' => 'urbano',
                'description' => 'Ciudades, arquitectura y vida urbana',
            ],
            [
                'name' => 'Arte',
                'slug' => 'arte',
                'description' => 'Pinturas, ilustraciones y obras artísticas',
            ],
        ];

        foreach ($categories as $categoryData) {
            Category::create($categoryData);
        }

        // Obtener el primer usuario o crear uno de ejemplo
        $user = User::first();
        if (!$user) {
            $user = User::create([
                'name' => 'Administrador',
                'email' => 'admin@vision4k.com',
                'password' => bcrypt('password'),
            ]);
        }

        // Crear wallpapers de ejemplo
        $wallpapers = [
            [
                'title' => 'Aurora Boreal 4K',
                'description' => 'Increíble aurora boreal capturada en las montañas de Noruega',
                'file_path' => 'https://picsum.photos/3840/2160?random=1',
                'category_id' => 1, // Naturaleza
                'tags' => 'aurora,boreal,naturaleza,noche,montañas,luces',
                'resolution' => '3840x2160',
                'file_size' => 5242880, // 5MB
                'downloads_count' => 1243,
                'is_featured' => true,
            ],
            [
                'title' => 'Waves Abstract Purple',
                'description' => 'Ondas abstractas en tonos púrpura y rosa vibrantes',
                'file_path' => 'https://picsum.photos/3840/2160?random=2',
                'category_id' => 2, // Abstracto
                'tags' => 'abstracto,ondas,púrpura,rosa,colores,vibrante',
                'resolution' => '2560x1440',
                'file_size' => 3145728, // 3MB
                'downloads_count' => 987,
                'is_featured' => true,
            ],
            [
                'title' => 'Space Nebula HD',
                'description' => 'Nebulosa colorida en el espacio profundo con estrellas brillantes',
                'file_path' => 'https://picsum.photos/1920/1080?random=3',
                'category_id' => 4, // Espacio
                'tags' => 'espacio,nebulosa,estrellas,cosmos,colorido,profundo',
                'resolution' => '1920x1080',
                'file_size' => 4194304, // 4MB
                'downloads_count' => 756,
                'is_featured' => false,
            ],
            [
                'title' => 'Clean Minimal Desktop',
                'description' => 'Diseño minimalista perfecto para productividad',
                'file_path' => 'https://picsum.photos/2560/1440?random=4',
                'category_id' => 5, // Minimalista
                'tags' => 'minimalista,limpio,simple,productividad,elegante',
                'resolution' => '2560x1440',
                'file_size' => 1048576, // 1MB
                'downloads_count' => 654,
                'is_featured' => false,
            ],
            [
                'title' => 'Cyber City 2077',
                'description' => 'Ciudad futurista con luces de neón y rascacielos',
                'file_path' => 'https://picsum.photos/3840/2160?random=5',
                'category_id' => 3, // Tecnología
                'tags' => 'futurista,ciudad,neón,rascacielos,cyber,tecnología',
                'resolution' => '3840x2160',
                'file_size' => 6291456, // 6MB
                'downloads_count' => 543,
                'is_featured' => true,
            ],
            [
                'title' => 'Gaming Setup RGB',
                'description' => 'Setup gaming épico con iluminación RGB',
                'file_path' => 'https://picsum.photos/1920/1080?random=6',
                'category_id' => 6, // Gaming
                'tags' => 'gaming,setup,rgb,iluminación,épico,videojuegos',
                'resolution' => '1920x1080',
                'file_size' => 3670016, // 3.5MB
                'downloads_count' => 432,
                'is_featured' => false,
            ],
        ];

        foreach ($wallpapers as $wallpaperData) {
            $wallpaperData['user_id'] = $user->id;
            Wallpaper::create($wallpaperData);
        }
    }
}
