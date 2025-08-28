<?php

/**
 * Seeder: Crear usuario administrador inicial
 *
 * Este seeder crea un usuario administrador por defecto para el
 * sistema Vision4K. Es útil durante el desarrollo y la instalación inicial.
 *
 * Usuario creado:
 * - Email: admin@vision4k.com
 * - Nombre: Administrador
 * - Contraseña: admin123 (debe cambiarse en producción)
 * - Rol: admin (acceso completo)
 *
 * Funcionalidades:
 * - Crea usuario usando firstOrCreate para evitar duplicados
 * - Asigna automáticamente el rol de administrador
 * - Verifica que el rol 'admin' exista antes de asignarlo
 * - Es idempotente (se puede ejecutar múltiples veces)
 *
 * Uso:
 * php artisan db:seed --class=AdminUserSeeder
 * php artisan db:seed (desde DatabaseSeeder)
 *
 * ⚠️ SEGURIDAD ⚠️
 * - Cambiar la contraseña por defecto en producción
 * - Considerar deshabilitar este seeder en producción
 * - Usar variables de entorno para credenciales sensibles
 */

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminRole = \App\Models\Role::where('slug', 'admin')->first();

        if ($adminRole) {
            $admin = \App\Models\User::firstOrCreate(
                ['email' => 'admin@vision4k.com'],
                [
                    'name' => 'Administrador',
                    'password' => bcrypt('admin123'),
                    'email_verified_at' => now(),
                ]
            );

            // Asignar rol de admin si no lo tiene
            if (!$admin->hasRole('admin')) {
                $admin->roles()->attach($adminRole);
            }
        }
    }
}
