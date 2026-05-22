<?php

use app\Http\Controllers\ChatAiController;
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

// 2. Rute Halaman Simulator Gula Darah & UPF
Route::get('/simulator', function () {
    return Inertia::render('Simulator');
})->name('simulator');

// 3. Rute Halaman Perisai Darurat Craving
Route::get('/skin-detector', function () {
    return Inertia::render('SkinDetector'); // Merender file SkinDetectorPage.jsx
})->name('skin-detector');

// 4. Rute Halaman Trivia Edukasi Medis
Route::get('/trivia', function () {
    return Inertia::render('TriviaVault');
})->name('trivia');

Route::get('/glyco-smoke', function () {
    return Inertia::render('GlycoSmoke');
})->name('glyco.smoke');    

Route::get('/aicoach', function () {
    return Inertia::render('AiCoach');
})->name('glyco.aicoach');   

Route::get('/butterfly-effect', function () {
    return Inertia::render('AntiDrugSimulator'); // Resources/js/Pages/AntiDrugSimulator.jsx
})->name('butterfly.effect');

Route::post('/chat', 'App\Http\Controllers\ChatAiController@sendToGemini');

Route::get('/chat', function() {
    return redirect()->route('dashboard'); // Jika diakses via GET, alihkan halus ke dashboard
});