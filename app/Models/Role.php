<?php

/**
 * Modelo Role - Gestiona roles de usuario en Vision4K
 *
 * Funcionalidades: roles (admin, user), relación con usuarios, permisos básicos
 * Relaciones: users (muchos-a-muchos)
 * Métodos clave: hasPermission()
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }

    public function hasPermission(string $permission): bool
    {
        // Por ahora, los roles tienen permisos implícitos
        // En el futuro se puede expandir con una tabla de permisos
        return match ($this->slug) {
            'admin' => true, // Admin tiene todos los permisos
            'user' => in_array($permission, ['view_wallpapers', 'download_wallpapers', 'manage_favorites']),
            default => false,
        };
    }
}
