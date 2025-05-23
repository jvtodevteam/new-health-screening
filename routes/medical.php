<?php

use App\Http\Controllers\Medical\Auth\LoginController;
use App\Http\Controllers\Medical\DashboardController;
use App\Http\Controllers\Medical\ExaminationController;
use App\Http\Controllers\Medical\ParticipantController;
use App\Http\Controllers\Medical\RegistrationController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
Route::post('/medical/examination/update-results', [ParticipantController::class, 'storeApi'])
    ->name('api.update-examination-results');
Route::prefix('medical')->name('medical.')->group(function () {
    // Guest routes (redirect to dashboard if already logged in)
    Route::middleware('guest:medical')->group(function () {
        Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
        Route::post('/login', [LoginController::class, 'login']);
    });

    // Protected routes (requires medical staff authentication)
    Route::middleware('auth.medical')->group(function () {
        // Dashboard
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::post('/logout', [LoginController::class, 'logout'])->name('logout');
        
        // Pendaftaran (Registrations)
        Route::get('/registrations', [RegistrationController::class, 'index'])->name('registrations.index');
        Route::get('/registrations/group', [RegistrationController::class, 'group'])->name('registrations.group');
        Route::get('/registrations/{participant}/edit', [RegistrationController::class, 'edit'])->name('registrations.edit');
        Route::post('/registrations/{participant}', [RegistrationController::class, 'update'])->name('registrations.update');
        
        // Pemeriksaan (Examinations)
        Route::get('/examinations', [ExaminationController::class, 'index'])->name('examinations.index');
        Route::get('/examinations/{participant}/qrcode', [ExaminationController::class, 'qrcode'])->name('examinations.qrcode');
        Route::get('/examinations/{participant}/print', [ExaminationController::class, 'print'])->name('examinations.print');
    });
});

// Public verification endpoint
Route::get('/verify-examination/{code}', [ExaminationController::class, 'verify'])->name('examinations.verify');
// Tambahkan route ini di web.php
Route::post('/verify-examination/{code}/identity', [ExaminationController::class, 'verifyIdentity'])->name('examinations.verify.identity');