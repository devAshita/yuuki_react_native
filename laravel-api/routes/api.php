<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\ImageController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/data', function () {
    return response()->json(['message' => 'This is data from Laravel']);
});

Route::post('/login', [LoginController::class, 'login']);
Route::get('/request-token', [LoginController::class, 'getRequestToken']);
Route::get('/access-token', [LoginController::class, 'getAccessToken']);
Route::post('/auth_check', [LoginController::class, 'auth_check']);
Route::post('/logout', function () {
    Auth::logout();
    return response()->json(['message' => 'Logged out']);
});

Route::post('/upload', [ImageController::class, 'image_post']);
Route::get('/list', [ImageController::class, 'list']);





