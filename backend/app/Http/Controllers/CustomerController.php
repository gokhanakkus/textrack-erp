<?php

namespace App\Http\Controllers;

use App\Http\Resources\CustomerResource;
use App\Models\Customer;
use App\Services\CustomerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function __construct(private CustomerService $service) {}

    public function index(Request $request): JsonResponse
    {
        $customers = $this->service->list($request->all());
        return response()->json(CustomerResource::collection($customers)->response()->getData(true));
    }

    // Dropdown için tüm liste (sayfalama olmadan)
    public function all(): JsonResponse
    {
        return response()->json(CustomerResource::collection($this->service->all()));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'           => 'required|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'email'          => 'nullable|email|max:255',
            'phone'          => 'nullable|string|max:30',
            'city'           => 'nullable|string|max:100',
            'address'        => 'nullable|string',
            'tax_no'         => 'nullable|string|max:20',
        ]);

        $customer = $this->service->create($data);
        return response()->json(new CustomerResource($customer), 201);
    }

    public function show(Customer $customer): JsonResponse
    {
        return response()->json(new CustomerResource($this->service->find($customer->id)));
    }

    public function update(Request $request, Customer $customer): JsonResponse
    {
        $data = $request->validate([
            'name'           => 'sometimes|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'email'          => 'nullable|email|max:255',
            'phone'          => 'nullable|string|max:30',
            'city'           => 'nullable|string|max:100',
            'address'        => 'nullable|string',
            'tax_no'         => 'nullable|string|max:20',
        ]);

        return response()->json(new CustomerResource($this->service->update($customer, $data)));
    }

    public function destroy(Customer $customer): JsonResponse
    {
        $this->service->delete($customer);
        return response()->json(null, 204);
    }
}
