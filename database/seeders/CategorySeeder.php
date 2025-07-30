<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Naturaleza',
                'description' => 'Paisajes, montañas, bosques, océanos y vida silvestre',
            ],
            [
                'name' => 'Tecnología',
                'description' => 'Fondos futurísticos, gadgets, circuitos y elementos tech',
            ],
            [
                'name' => 'Arte Abstracto',
                'description' => 'Formas geométricas, patrones y diseños artísticos abstractos',
            ],
            [
                'name' => 'Espacio',
                'description' => 'Galaxias, planetas, nebulosas y el cosmos',
            ],
            [
                'name' => 'Ciudades',
                'description' => 'Skylines, arquitectura urbana y paisajes citadinos',
            ],
            [
                'name' => 'Minimalista',
                'description' => 'Diseños simples, limpios y elegantes',
            ],
            [
                'name' => 'Gaming',
                'description' => 'Videojuegos, personajes y mundos gaming',
            ],
            [
                'name' => 'Anime',
                'description' => 'Personajes de anime, manga y cultura japonesa',
            ],
        ];

        foreach ($categories as $category) {
            Category::create([
                'name' => $category['name'],
                'slug' => Str::slug($category['name']),
                'description' => $category['description'],
                'is_active' => true,
            ]);
        }
    }
}
