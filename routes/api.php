<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\RevenueController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\TodoController;
use Illuminate\Support\Facades\Redirect;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::controller(AuthController::class)->group(function () {
    Route::post('/auth/register', 'createUser');
    Route::post('/auth/login', 'loginUser');
});

//apiResource - exclude routes that present HTML templates such as create and edit.
Route::apiResource('posts', PostController::class)->middleware('auth:sanctum');

Route::middleware(['auth:sanctum'])
    ->group(function() {
        // If you need to add additional routes to a resource controller beyond the default set of resource routes,
        // you should define those routes before your call to the Route::resource method
        // there is a supplemental routes for image updating
        Route::post('customers/{id}', [CustomerController::class, 'update']);
        Route::apiResources([
            'invoices' => InvoiceController::class,
            'revenues' => RevenueController::class,
            'todos' => TodoController::class,
        ]);

        //The missing method accepts a closure that will be invoked
        //if an implicitly bound model can not be found for any of the resource's routes:
        Route::apiResource('customers', CustomerController::class)
            ->missing(function (Request $request) {
                return Redirect::route('customers.index');
        });
});

