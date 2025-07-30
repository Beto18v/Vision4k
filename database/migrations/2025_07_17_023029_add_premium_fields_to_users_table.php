<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_premium')->default(false);
            $table->timestamp('premium_expires_at')->nullable();
            $table->string('avatar')->nullable();
            $table->string('role')->default('user'); // user, admin, moderator
            $table->integer('download_limit')->default(10); // limite diario para usuarios gratuitos
            $table->integer('downloads_today')->default(0);
            $table->date('last_download_reset')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'is_premium',
                'premium_expires_at',
                'avatar',
                'role',
                'download_limit',
                'downloads_today',
                'last_download_reset'
            ]);
        });
    }
};
