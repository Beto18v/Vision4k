<?php

/**
 * Modelo User - Gestiona usuarios del sistema Vision4K
 *
 * Funcionalidades: autenticación, roles (admin/user), wallpapers, descargas, favoritos, premium
 * Relaciones: wallpapers, downloads, favorites, roles
 * Métodos clave: hasRole(), isAdmin(), assignRole(), getRoleDisplayName(), canDownload()
 */

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Carbon\Carbon;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_premium',
        'premium_expires_at',
        'download_limit',
        'downloads_today',
        'last_download_reset',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_premium' => 'boolean',
            'premium_expires_at' => 'datetime',
            'last_download_reset' => 'date',
        ];
    }

    /**
     * Relación con Wallpapers subidos por el usuario
     */
    public function wallpapers(): HasMany
    {
        return $this->hasMany(Wallpaper::class);
    }

    /**
     * Relación con Downloads del usuario
     */
    public function downloads(): HasMany
    {
        return $this->hasMany(Download::class);
    }

    /**
     * Relación con Favoritos del usuario
     */
    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    /**
     * Wallpapers favoritos del usuario
     */
    public function favoriteWallpapers()
    {
        return $this->belongsToMany(Wallpaper::class, 'favorites')->withTimestamps();
    }

    /**
     * Relación con Roles del usuario
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    /**
     * Verificar si el usuario tiene un rol específico
     */
    public function hasRole(string $roleSlug): bool
    {
        return $this->roles()->where('slug', $roleSlug)->exists();
    }

    /**
     * Verificar si el usuario es usuario regular
     */
    public function isUser(): bool
    {
        return $this->hasRole('user');
    }

    /**
     * Asignar un rol al usuario
     */
    public function assignRole(string $roleSlug): void
    {
        $role = Role::where('slug', $roleSlug)->first();
        if ($role && !$this->hasRole($roleSlug)) {
            $this->roles()->attach($role);
        }
    }

    /**
     * Remover un rol del usuario
     */
    public function removeRole(string $roleSlug): void
    {
        $role = Role::where('slug', $roleSlug)->first();
        if ($role) {
            $this->roles()->detach($role);
        }
    }

    /**
     * Obtener el rol principal del usuario (el primero asignado)
     */
    public function getMainRole()
    {
        return $this->roles()->first();
    }

    /**
     * Obtener el nombre del rol para mostrar
     */
    public function getRoleDisplayName(): string
    {
        $role = $this->getMainRole();
        return $role ? ucfirst($role->name) : 'Usuario';
    }

    /**
     * Verificar si el usuario es admin
     */
    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    /**
     * Verificar si el usuario es moderador
     */
    public function isModerator(): bool
    {
        return $this->role === 'moderator';
    }

    /**
     * Verificar si puede descargar más wallpapers hoy
     */
    public function canDownload(): bool
    {
        if ($this->isPremiumActive()) {
            return true;
        }

        // Resetear contador si es un nuevo día
        if ($this->last_download_reset === null || $this->last_download_reset->isYesterday()) {
            $this->resetDailyDownloads();
        }

        return $this->downloads_today < $this->download_limit;
    }

    /**
     * Resetear contador diario de descargas
     */
    public function resetDailyDownloads(): void
    {
        $this->update([
            'downloads_today' => 0,
            'last_download_reset' => Carbon::today(),
        ]);
    }

    /**
     * Incrementar contador de descargas
     */
    public function incrementDownloadCount(): void
    {
        if (!$this->isPremiumActive()) {
            $this->increment('downloads_today');
        }
    }

    /**
     * Obtener el límite de descargas restantes
     */
    public function getRemainingDownloads(): int
    {
        if ($this->isPremiumActive()) {
            return -1; // Ilimitado
        }

        return max(0, $this->download_limit - $this->downloads_today);
    }
}
