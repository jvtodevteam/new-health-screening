<?php

use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\InfoController;
use App\Http\Controllers\PartnerController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ScreeningController;
use App\Http\Controllers\SettingsController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });
Route::get('/staff', function () {
    return Inertia::render('Staff', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});
Route::get('/success', function () {
    return Inertia::render('Success', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/generate-payment', [ScreeningController::class,'generatePayment']);
Route::get('/payment-success/{id}', [ScreeningController::class,'paymentSuccess']);

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/info', [InfoController::class, 'index'])->name('info');

// Screenings routes
Route::prefix('screenings')->group(function () {
    Route::get('/', [ScreeningController::class, 'index'])->name('screenings.index');
    Route::get('/create', [ScreeningController::class, 'create'])->name('screenings.create');
    Route::post('/', [ScreeningController::class, 'store'])->name('screenings.store');
    Route::get('/{screening}', [ScreeningController::class, 'show'])->name('screenings.show');
    Route::get('/{screening}/ticket', [ScreeningController::class, 'ticket'])->name('screenings.ticket');
    Route::get('/{screening}/success', [ScreeningController::class, 'success'])->name('screenings.success');
});

// Payment webhook
Route::post('/payment-webhook', [ScreeningController::class, 'handlePaymentWebhook'])->name('payment.webhook');

Route::get('/profile', [ProfileController::class, 'index'])->name('profile');

// Partner application routes
Route::prefix('partners')->group(function () {
    Route::post('/', [PartnerController::class, 'store'])->name('partners.store');
});

// Static pages
Route::get('/terms', function () {
    return Inertia::render('StaticPages/Terms');
})->name('terms');

Route::get('/privacy', function () {
    return Inertia::render('StaticPages/Privacy');
})->name('privacy');
Route::get('/auth/google', [GoogleController::class, 'redirectToGoogle'])->name('login.google');
Route::get('/auth/google/callback', [GoogleController::class, 'handleGoogleCallback'])->name('login.google.callback');
Route::get('/language/{lang}', function($lang) {
    session(['locale' => $lang]);
    return redirect()->back();
})->name('settings.update-language');


require __DIR__.'/auth.php';
require __DIR__.'/medical.php';
