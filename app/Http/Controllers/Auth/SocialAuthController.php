<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    /**
     * Redirect to Google OAuth
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle Google OAuth callback
     */
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            $user = User::where('email', $googleUser->getEmail())->first();

            if ($user) {
                // User exists, update Google ID if not set
                if (!$user->google_id) {
                    $user->update(['google_id' => $googleUser->getId()]);
                }
            } else {
                // Create new user
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'password' => Hash::make(uniqid()), // Random password since OAuth
                    'email_verified_at' => now(),
                ]);
            }

            Auth::login($user);

            return redirect()->intended(route('dashboard'));
        } catch (\Exception $e) {
            return redirect()->route('login')->withErrors(['social' => 'Error al iniciar sesión con Google.']);
        }
    }

    /**
     * Redirect to Facebook OAuth
     */
    // public function redirectToFacebook()
    // {
    //     return Socialite::driver('facebook')->redirect();
    // }

    /**
     * Handle Facebook OAuth callback
     */
    // public function handleFacebookCallback()
    // {
    //     try {
    //         $facebookUser = Socialite::driver('facebook')->user();

    //         $user = User::where('email', $facebookUser->getEmail())->first();

    //         if ($user) {
    //             // User exists, update Facebook ID if not set
    //             if (!$user->facebook_id) {
    //                 $user->update(['facebook_id' => $facebookUser->getId()]);
    //             }
    //         } else {
    //             // Create new user
    //             $user = User::create([
    //                 'name' => $facebookUser->getName(),
    //                 'email' => $facebookUser->getEmail(),
    //                 'facebook_id' => $facebookUser->getId(),
    //                 'password' => Hash::make(uniqid()), // Random password since OAuth
    //                 'email_verified_at' => now(),
    //             ]);
    //         }

    //         Auth::login($user);

    //         return redirect()->intended(route('dashboard'));
    //     } catch (\Exception $e) {
    //         return redirect()->route('login')->withErrors(['social' => 'Error al iniciar sesión con Facebook.']);
    //     }
    // }
}
