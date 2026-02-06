<?php

use App\Http\Controllers\NeuralAdvisorController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SimulationHistoryController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('/', function () {
        return view('welcome');
    })->name('landing');
});

Route::middleware('auth')->group(function () {
    Route::get('/home', function () {
        return view('home');
    })->name('home');

    Route::get('/comparison', function () {
        return view('comparison');
    })->name('comparison');

    Route::get('/sim/3d', function () {
        return view('sim-3d');
    })->name('sim.3d');

    Route::get('/neural', function () {
        return view('neural');
    })->name('neural.index');
    Route::get('/neural/status', [NeuralAdvisorController::class, 'status'])->name('neural.status');

    Route::get('/history', [SimulationHistoryController::class, 'index'])->name('history.index');
    Route::post('/history', [SimulationHistoryController::class, 'store'])->name('history.store');
    Route::post('/nn/suggest', [NeuralAdvisorController::class, 'suggest'])->name('nn.suggest');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
