<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\WallpaperController;
use App\Http\Controllers\WelcomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [WelcomeController::class, 'index'])->name('welcome');

Route::middleware(['auth'])->group(function () {
    // Dashboard routes
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/dashboard/wallpapers', [DashboardController::class, 'store'])->name('dashboard.store');
    Route::put('/dashboard/wallpapers/{wallpaper}', [DashboardController::class, 'update'])->name('dashboard.wallpapers.update');
    Route::delete('/dashboard/wallpapers/{wallpaper}', [DashboardController::class, 'destroy'])->name('dashboard.wallpapers.destroy');
    Route::post('/dashboard/categories', [DashboardController::class, 'storeCategory'])->name('dashboard.categories.store');
    Route::get('/dashboard/analytics', [DashboardController::class, 'analytics'])->name('dashboard.analytics');
});

// Public wallpaper routes
Route::get('/wallpapers', [WallpaperController::class, 'index'])->name('wallpapers.index');
Route::get('/wallpapers/{wallpaper}', [WallpaperController::class, 'show'])->name('wallpapers.show');
Route::get('/wallpapers/{wallpaper}/download', [WallpaperController::class, 'download'])->name('wallpapers.download');

// New routes
Route::get('/trending', [WallpaperController::class, 'trending'])->name('wallpapers.trending');
Route::get('/premium', [WallpaperController::class, 'premium'])->name('wallpapers.premium');

// Favorite and download routes (requires auth)
Route::middleware('auth')->group(function () {
    Route::post('/wallpapers/{wallpaper}/favorite', [WallpaperController::class, 'toggleFavorite'])->name('wallpapers.favorite');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
