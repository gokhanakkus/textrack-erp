<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStockRequest;
use App\Http\Resources\StockResource;
use App\Models\Stock;
use App\Services\StockService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StockController extends Controller
{
    public function __construct(private StockService $stockService) {}

    public function index(Request $request): JsonResponse
    {
        $stocks = $this->stockService->list($request->all());
        return response()->json(StockResource::collection($stocks)->response()->getData(true));
    }

    public function store(StoreStockRequest $request): JsonResponse
    {
        $stock = $this->stockService->create($request->validated());
        return response()->json(new StockResource($stock->load('product')), 201);
    }

    public function show(Stock $stock): JsonResponse
    {
        return response()->json(new StockResource($stock->load('product')));
    }

    public function update(StoreStockRequest $request, Stock $stock): JsonResponse
    {
        $stock = $this->stockService->update($stock, $request->validated());
        return response()->json(new StockResource($stock));
    }

    public function destroy(Stock $stock): JsonResponse
    {
        $this->stockService->delete($stock);
        return response()->json(null, 204);
    }

    public function critical(): JsonResponse
    {
        return response()->json(StockResource::collection($this->stockService->getCriticalStocks()));
    }
}
