<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title inertia>{{ config('app.name', 'Laravel') }}</title>
        @viteReactRefresh
        
        {{-- 👈 PASTIKAN LINE DI BAWAH INI MEMANGGIL FILE CSS DAN JSX SEPERTI INI --}}
        @vite(['resources/css/app.css', 'resources/js/app.jsx', "resources/js/pages/{$page['component']}.jsx"])
        
        @inertiaHead
    </head>
    <body class="bg-slate-950 text-slate-100 antialiased">
        @inertia
    </body>
</html>