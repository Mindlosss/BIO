<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/comparison', function () {
    return view('comparison');
})->name('comparison');
