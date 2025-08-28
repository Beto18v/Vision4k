<?php

/**
 * Migración: Crear tabla de roles
 *
 * Esta migración crea la tabla 'roles' que almacena los diferentes
 * roles de usuario en el sistema Vision4K.
 *
 * Estructura de la tabla:
 * - id: Identificador único del rol
 * - name: Nombre del rol (ej: 'Administrador', 'Usuario')
 * - slug: Identificador único del rol (ej: 'admin', 'user')
 * - description: Descripción opcional del rol
 * - timestamps: Campos created_at y updated_at
 *
 * Roles incluidos:
 * - admin: Administrador con acceso completo
 * - user: Usuario regular con acceso limitado
 *
 * Uso:
 * php artisan migrate
 * php artisan migrate:rollback (para deshacer)
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
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->string('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
};
