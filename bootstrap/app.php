<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // 💡 KODE PERBAIKAN UNTUK LARAVEL 12 ADA DI SINI:
        $middleware->validateCsrfTokens(except: [
            '/chat' // Menghapus verifikasi CSRF khusus untuk jalur chat AI
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();