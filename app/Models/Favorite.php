<?php

/**
 * Modelo Favorite - Gestiona wallpapers favoritos de usuarios en Vision4K
 *
 * Funcionalidades: marcar/desmarcar favoritos, relación muchos-a-muchos
 * Relaciones: user, wallpaper
 * Uso: sistema de favoritos personales de cada usuario
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Favorite extends Model
{
    protected $fillable = [
        'user_id',
        'wallpaper_id',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relación con User
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relación con Wallpaper
     */
    public function wallpaper(): BelongsTo
    {
        return $this->belongsTo(Wallpaper::class);
    }
}
