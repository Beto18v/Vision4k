<?php

/**
 * Seeder Principal: Poblar base de datos
 *
 * Este es el seeder principal que coordina la ejecución de todos
 * los seeders del sistema Vision4K. Se ejecuta cuando se quiere
 * poblar la base de datos con datos iniciales.
 *
 * Seeders incluidos:
 * - RoleSeeder: Crea los roles básicos (admin, user)
 * - AdminUserSeeder: Crea usuario administrador por defecto
 *
 * Orden de ejecución:
 * 1. RoleSeeder (primero crear roles)
 * 2. AdminUserSeeder (luego crear usuario admin)
 *
 * Uso:
 * php artisan db:seed (ejecuta todos los seeders)
 * php artisan db:seed --class=DatabaseSeeder (explícito)
 * php artisan migrate:fresh --seed (migrar y seedear)
 *
 * ⚠️ IMPORTANTE ⚠️
 * - Solo ejecutar en entornos de desarrollo
 * - Revisar credenciales antes de usar en producción
 * - Los seeders son idempotentes (se pueden ejecutar múltiples veces)
 */

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            AdminUserSeeder::class,
        ]);
    }
}
