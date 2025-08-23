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
            if (!Schema::hasColumn('wallpapers', 'views_count')) {
                $table->integer('views_count')->default(0)->after('downloads_count');
            }
            // Crear el índice solo si no existe
            $table->index('views_count', 'wallpapers_views_count_index');
            if (!Schema::hasColumn('wallpapers', 'is_premium')) {
                $table->boolean('is_premium')->default(false)->after('is_featured');
            }
            $table->index('is_premium', 'wallpapers_is_premium_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('wallpapers', function (Blueprint $table) {
            $table->dropColumn(['views_count', 'is_premium']);
        });
    }
};
