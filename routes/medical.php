<?php
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;

Route::prefix('medical')->name('medical.')->group(function () {
    // Authentication routes
    Route::middleware('guest:medical')->group(function () {
        Route::get('/login', [App\Http\Controllers\Medical\Auth\LoginController::class, 'showLoginForm'])->name('login');
        Route::post('/login', [App\Http\Controllers\Medical\Auth\LoginController::class, 'login']);
    });

    // Protected routes
    Route::middleware('auth.medical')->group(function () {
        Route::get('/dashboard', [App\Http\Controllers\Medical\DashboardController::class, 'index'])->name('dashboard');
        Route::post('/logout', [App\Http\Controllers\Medical\Auth\LoginController::class, 'logout'])->name('logout');
        
        // Route untuk mengelola screening dan participant
        Route::get('/screenings', [App\Http\Controllers\Medical\ScreeningController::class, 'index'])->name('screenings.index');
        Route::get('/screenings/{screening}', [App\Http\Controllers\Medical\ScreeningController::class, 'show'])->name('screenings.show');
        Route::get('/participants/{participant}/examine', [App\Http\Controllers\Medical\ParticipantController::class, 'examine'])->name('participants.examine');
        Route::post('/participants/{participant}/examination', [App\Http\Controllers\Medical\ParticipantController::class, 'storeExamination'])->name('participants.examination.store');
    });
});