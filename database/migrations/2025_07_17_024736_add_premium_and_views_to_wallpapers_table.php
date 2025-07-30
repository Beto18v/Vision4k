<?php

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
        Schema::table('wallpapers', function (Blueprint $table) {
            // Verificar si las columnas no existen antes de agregarlas
            if (!Schema::hasColumn('wallpapers', 'is_premium')) {
                $table->boolean('is_premium')->default(false);
            }
            if (!Schema::hasColumn('wallpapers', 'views_count')) {
                $table->integer('views_count')->default(0);
            }

            // Agregar índices
            $table->index(['is_premium', 'is_active']);
            $table->index(['views_count']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('wallpapers', function (Blueprint $table) {
            $table->dropColumn(['is_premium', 'views_count']);
            $table->dropIndex(['is_premium', 'is_active']);
            $table->dropIndex(['views_count']);
        });
    }
};
