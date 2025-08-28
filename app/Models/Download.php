<?php

/**
 * Modelo Download - Registra descargas de wallpapers en Vision4K
 *
 * Funcionalidades: registro de descargas, IP del usuario, estadísticas
 * Relaciones: user, wallpaper
 * Uso: estadísticas de descargas, control de límites por usuario
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Download extends Model
{
    protected $fillable = [
        'user_id',
        'wallpaper_id',
        'ip_address',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function wallpaper(): BelongsTo
    {
        return $this->belongsTo(Wallpaper::class);
    }
}
