<?php

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
        'avatar',
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
     * Verificar si el usuario es premium activo
     */
    public function isPremiumActive(): bool
    {
        return $this->is_premium &&
            ($this->premium_expires_at === null || $this->premium_expires_at->isFuture());
    }

    /**
     * Verificar si el usuario es admin
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
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
