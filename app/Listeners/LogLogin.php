<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\Log;

class LogLogin
{
    public function handle(Login $event): void
    {
        Log::channel('login')->info('User login', [
            'timestamp' => now()->toDateTimeString(),
            'user_id' => $event->user->getAuthIdentifier(),
            'name' => $event->user->name,
        ]);
    }
}
