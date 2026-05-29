<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductionLogResource;
use App\Models\ProductionLog;
use App\Models\ProductionOrder;
use App\Services\ProductionLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductionLogController extends Controller
{
    public function __construct(private ProductionLogService $service) {}

    /** Üretim emrine ait tüm vardiya kayıtları */
    public function index(ProductionOrder $productionOrder): JsonResponse
    {
        $logs = $this->service->getForOrder($productionOrder);
        return response()->json(ProductionLogResource::collection($logs));
    }

    /** Yeni vardiya kaydı */
    public function store(Request $request, ProductionOrder $productionOrder): JsonResponse
    {
        $data = $request->validate([
            'date'              => 'required|date',
            'shift'             => 'required|in:sabah,öğle,gece',
            'produced_quantity' => 'required|integer|min:1',
            'notes'             => 'nullable|string',
        ]);

        $log = $this->service->create($productionOrder, $data);
        return response()->json(new ProductionLogResource($log), 201);
    }

    /** Vardiya kaydı güncelle */
    public function update(Request $request, ProductionOrder $productionOrder, ProductionLog $log): JsonResponse
    {
        $data = $request->validate([
            'date'              => 'sometimes|date',
            'shift'             => 'sometimes|in:sabah,öğle,gece',
            'produced_quantity' => 'sometimes|integer|min:1',
            'notes'             => 'nullable|string',
        ]);

        return response()->json(new ProductionLogResource($this->service->update($log, $data)));
    }

    /** Vardiya kaydı sil */
    public function destroy(ProductionOrder $productionOrder, ProductionLog $log): JsonResponse
    {
        $this->service->delete($log);
        return response()->json(null, 204);
    }
}
