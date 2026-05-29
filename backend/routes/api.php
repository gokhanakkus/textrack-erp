<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\FinanceController;
use App\Http\Controllers\ProductionLogController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductionOrderController;
use App\Http\Controllers\QualityControlController;
use App\Http\Controllers\StockController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
});

Route::middleware(['jwt.auth'])->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    Route::get('customers/all', [CustomerController::class, 'all']);
    Route::apiResource('customers', CustomerController::class);
    Route::apiResource('orders', OrderController::class);
    Route::apiResource('stocks', StockController::class);
    Route::apiResource('production-orders', ProductionOrderController::class);

    // Vardiya kayıtları — üretim emrine nested
    Route::get('production-orders/{productionOrder}/logs', [ProductionLogController::class, 'index']);
    Route::post('production-orders/{productionOrder}/logs', [ProductionLogController::class, 'store']);
    Route::put('production-orders/{productionOrder}/logs/{log}', [ProductionLogController::class, 'update']);
    Route::delete('production-orders/{productionOrder}/logs/{log}', [ProductionLogController::class, 'destroy']);

    Route::get('quality-controls/stats', [QualityControlController::class, 'stats']);
    Route::apiResource('quality-controls', QualityControlController::class);

    Route::get('dashboard', [DashboardController::class, 'index']);

    Route::get('finance/stats',  [FinanceController::class, 'stats']);
    Route::get('finance/orders', [FinanceController::class, 'orders']);

    Route::get('notifications', [NotificationController::class, 'index']);
    Route::patch('notifications/read-all', [NotificationController::class, 'markAllRead']);
    Route::patch('notifications/{id}/read', [NotificationController::class, 'markRead']);
});
