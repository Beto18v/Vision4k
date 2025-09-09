<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use GuzzleHttp\Client;
use Laravel\Socialite\Facades\Socialite;

class HttpClientServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Configurar cliente HTTP por defecto con certificados actualizados
        $this->app->singleton(Client::class, function ($app) {
            $certPath = storage_path('ssl/cacert.pem');

            return new Client([
                'verify' => file_exists($certPath) ? $certPath : true,
                'curl' => [
                    CURLOPT_SSL_VERIFYPEER => true,
                    CURLOPT_SSL_VERIFYHOST => 2,
                    CURLOPT_CAINFO => $certPath,
                ],
            ]);
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Configurar Socialite para usar cliente HTTP personalizado
        Socialite::extend('google', function ($app) {
            $config = $app['config']['services.google'];

            return Socialite::buildProvider(
                \Laravel\Socialite\Two\GoogleProvider::class,
                $config
            )->setHttpClient(app(Client::class));
        });
    }
}
