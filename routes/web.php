<?php

use App\Http\Controllers\ChatAiController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// 1. Rute Halaman Welcome (Splash Screen) sebagai halaman utama
Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('welcome');

// 2. Rute Halaman Dashboard Utama
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->name('dashboard');

// 3. Rute Halaman Simulator Gula Darah & UPF
Route::get('/simulator', function () {
    return Inertia::render('Simulator');
})->name('simulator');

// 4. Rute Halaman Skin Center
Route::get('/skin-center', function () {
    return Inertia::render('SkinCenter'); 
})->name('skin-center');

// 5. Rute Halaman Glyco Smoke
Route::get('/glyco-smoke', function () {
    return Inertia::render('GlycoSmoke');
})->name('glyco.smoke');    

// 6. Rute Halaman MindHub Anti-Narkoba (Sudah Disesuaikan)
Route::get('/mindhub', function () {
    return Inertia::render('MindHub'); // Memanggil file resources/js/Pages/MindHub.jsx
})->name('mindhub');

// 7. Rute Fitur AI Chat
Route::post('/chat', [ChatAiController::class, 'sendToGemini']);
Route::get('/chat', function() {
    return redirect()->route('dashboard'); // Jika diakses via GET, alihkan halus ke dashboard
});