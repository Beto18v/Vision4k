<?php

/**
 * Migración: Crear tabla pivot role_user
 *
 * Esta migración crea la tabla 'role_user' que establece la relación
 * muchos-a-muchos entre usuarios y roles en el sistema Vision4K.
 *
 * Estructura de la tabla:
 * - id: Identificador único de la relación
 * - user_id: ID del usuario (clave foránea)
 * - role_id: ID del rol (clave foránea)
 * - timestamps: Campos created_at y updated_at
 * - unique: Restricción única para evitar duplicados
 *
 * Relaciones:
 * - user_id referencia a users.id (con eliminación en cascada)
 * - role_id referencia a roles.id (con eliminación en cascada)
 *
 * Uso:
 * php artisan migrate
 * php artisan migrate:rollback (para deshacer)
 *
 * Nota: Esta tabla permite que un usuario tenga múltiples roles
 * y que un rol sea asignado a múltiples usuarios.
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('role_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('role_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            $table->unique(['user_id', 'role_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('role_user');
    }
};
