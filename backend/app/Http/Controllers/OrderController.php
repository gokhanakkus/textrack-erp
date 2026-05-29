<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function __construct(private OrderService $orderService) {}

    public function index(Request $request): JsonResponse
    {
        $orders = $this->orderService->list($request->all());
        return response()->json(OrderResource::collection($orders)->response()->getData(true));
    }

    public function store(StoreOrderRequest $request): JsonResponse
    {
        $order = $this->orderService->create($request->validated());
        return response()->json(new OrderResource($order), 201);
    }

    public function show(Order $order): JsonResponse
    {
        return response()->json(new OrderResource($order->load('user', 'productionOrder')));
    }

    public function update(UpdateOrderRequest $request, Order $order): JsonResponse
    {
        $order = $this->orderService->update($order, $request->validated());
        return response()->json(new OrderResource($order));
    }

    public function destroy(Order $order): JsonResponse
    {
        $this->orderService->delete($order);
        return response()->json(null, 204);
    }
}
