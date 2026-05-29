<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductionOrderRequest;
use App\Http\Resources\ProductionOrderResource;
use App\Models\ProductionOrder;
use App\Services\ProductionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductionOrderController extends Controller
{
    public function __construct(private ProductionService $productionService) {}

    public function index(Request $request): JsonResponse
    {
        $productions = $this->productionService->list($request->all());
        return response()->json(ProductionOrderResource::collection($productions)->response()->getData(true));
    }

    public function store(StoreProductionOrderRequest $request): JsonResponse
    {
        $production = $this->productionService->create($request->validated());
        return response()->json(new ProductionOrderResource($production->load('order')), 201);
    }

    public function show(ProductionOrder $productionOrder): JsonResponse
    {
        return response()->json(new ProductionOrderResource($productionOrder->load('order', 'qualityControls')));
    }

    public function update(Request $request, ProductionOrder $productionOrder): JsonResponse
    {
        $data = $request->validate([
            'production_line'     => 'sometimes|string|max:100',
            'start_date'          => 'sometimes|date',
            'end_date'            => 'nullable|date',
            'progress_percentage' => 'sometimes|integer|min:0|max:100',
            'status'              => 'sometimes|in:Waiting,Running,Paused,Completed',
            'notes'               => 'nullable|string',
        ]);

        $production = $this->productionService->update($productionOrder, $data);
        return response()->json(new ProductionOrderResource($production));
    }

    public function destroy(ProductionOrder $productionOrder): JsonResponse
    {
        $this->productionService->delete($productionOrder);
        return response()->json(null, 204);
    }
}
