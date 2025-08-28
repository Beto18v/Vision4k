<?php

/**
 * Seeder: Crear roles iniciales
 *
 * Este seeder crea los roles básicos del sistema Vision4K.
 * Se ejecuta durante la instalación inicial o cuando se necesita
 * poblar la base de datos con datos de prueba.
 *
 * Roles creados:
 * - Administrador (admin): Usuario con acceso completo al sistema
 * - Usuario (user): Usuario regular con acceso limitado
 *
 * Funcionalidades:
 * - Crea roles usando firstOrCreate para evitar duplicados
 * - Asigna nombre, slug y descripción a cada rol
 * - Es idempotente (se puede ejecutar múltiples veces)
 *
 * Uso:
 * php artisan db:seed --class=RoleSeeder
 * php artisan db:seed (desde DatabaseSeeder)
 *
 * Seguridad:
 * - Solo debe ejecutarse en entornos de desarrollo/instalación
 * - No debe ejecutarse en producción automáticamente
 */

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Administrador',
                'slug' => 'admin',
                'description' => 'Usuario con acceso completo al sistema',
            ],
            [
                'name' => 'Usuario',
                'slug' => 'user',
                'description' => 'Usuario regular con acceso limitado',
            ],
        ];

        foreach ($roles as $role) {
            \App\Models\Role::firstOrCreate(
                ['slug' => $role['slug']],
                $role
            );
        }
    }
}
