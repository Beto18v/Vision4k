<?php

/**
 * Controlador Settings - Gestiona la configuración de usuario en Vision4K
 *
 * Funcionalidades: actualización de perfil, cambio de contraseña, eliminación de cuenta
 * Métodos: index(), updateProfile(), updatePassword(), destroy()
 * Características: validación de datos, manejo de archivos de avatar
 */

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class SettingsController extends Controller
{
    /**
     * Mostrar la página de configuración
     */
    public function index()
    {
        return Inertia::render('settings/index', [
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    /**
     * Actualizar el perfil del usuario
     */
    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'avatar' => ['nullable', 'image', 'max:2048'], // 2MB max
        ]);

        $data = [
            'name' => $request->name,
            'email' => $request->email,
        ];

        // Manejar la subida del avatar
        if ($request->hasFile('avatar')) {
            // Eliminar avatar anterior si existe
            if ($user->avatar && Storage::exists('public/avatars/' . $user->avatar)) {
                Storage::delete('public/avatars/' . $user->avatar);
            }

            $avatarName = time() . '.' . $request->avatar->extension();
            $request->avatar->storeAs('public/avatars', $avatarName);
            $data['avatar'] = $avatarName;
        }

        $user->update($data);

        return back()->with('success', 'Perfil actualizado correctamente.');
    }

    /**
     * Actualizar la contraseña del usuario
     */
    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user = Auth::user();
        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return back()->with('success', 'Contraseña actualizada correctamente.');
    }

    /**
     * Eliminar la cuenta del usuario
     */
    public function destroy(Request $request)
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = Auth::user();

        // Eliminar avatar si existe
        if ($user->avatar && Storage::exists('public/avatars/' . $user->avatar)) {
            Storage::delete('public/avatars/' . $user->avatar);
        }

        // Eliminar wallpapers y archivos asociados
        foreach ($user->wallpapers as $wallpaper) {
            if ($wallpaper->file_path && Storage::exists($wallpaper->file_path)) {
                Storage::delete($wallpaper->file_path);
            }
            if ($wallpaper->thumbnail_path && Storage::exists($wallpaper->thumbnail_path)) {
                Storage::delete($wallpaper->thumbnail_path);
            }
        }

        // Eliminar descargas y favoritos
        $user->downloads()->delete();
        $user->favorites()->delete();

        // Logout y eliminar usuario
        Auth::logout();
        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/')->with('success', 'Cuenta eliminada correctamente.');
    }
}
