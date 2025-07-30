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
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('wallpaper_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            // Prevenir duplicados
            $table->unique(['user_id', 'wallpaper_id']);

            // Índices para optimizar consultas
            $table->index(['user_id', 'created_at']);
            $table->index(['wallpaper_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('favorites');
    }
};
