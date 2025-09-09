<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class UpdateSslCertificates extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ssl:update-certificates {--force : Force update even if certificates are recent}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update SSL certificates from Mozilla CA certificate store';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Updating SSL certificates...');

        $certUrl = 'https://curl.se/ca/cacert.pem';
        $certPath = storage_path('ssl/cacert.pem');

        try {
            // Download latest certificates (temporalmente sin verificación SSL)
            $response = Http::withoutVerifying()->timeout(30)->get($certUrl);

            if ($response->successful()) {
                // Backup existing certificates
                if (file_exists($certPath)) {
                    $backupPath = $certPath . '.backup';
                    copy($certPath, $backupPath);
                    $this->info('Existing certificates backed up');
                }

                // Save new certificates
                Storage::disk('local')->put('ssl/cacert.pem', $response->body());
                $this->info('SSL certificates updated successfully');

                // Update PHP configuration if possible
                $this->updatePhpConfig($certPath);

                $this->info('SSL certificates update completed!');
                $this->info('Certificate file: ' . $certPath);
            } else {
                $this->error('Failed to download certificates. HTTP status: ' . $response->status());
                return 1;
            }
        } catch (\Exception $e) {
            $this->error('Error updating certificates: ' . $e->getMessage());
            return 1;
        }

        return 0;
    }

    /**
     * Update PHP configuration to use the new certificates
     */
    private function updatePhpConfig($certPath)
    {
        // This would require writing to php.ini, which may not be possible
        // Instead, we'll document how to manually update it
        $this->info('To use these certificates, add this to your php.ini:');
        $this->info('curl.cainfo = "' . $certPath . '"');
        $this->info('openssl.cafile = "' . $certPath . '"');
    }
}
