<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreQualityControlRequest;
use App\Http\Resources\QualityControlResource;
use App\Models\QualityControl;
use App\Services\QualityControlService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QualityControlController extends Controller
{
    public function __construct(private QualityControlService $qcService) {}

    public function index(Request $request): JsonResponse
    {
        $qcs = $this->qcService->list($request->all());
        return response()->json(QualityControlResource::collection($qcs)->response()->getData(true));
    }

    public function store(StoreQualityControlRequest $request): JsonResponse
    {
        $qc = $this->qcService->create($request->validated());
        return response()->json(new QualityControlResource($qc->load('productionOrder.order')), 201);
    }

    public function show(QualityControl $qualityControl): JsonResponse
    {
        return response()->json(new QualityControlResource($qualityControl->load('productionOrder.order')));
    }

    public function update(Request $request, QualityControl $qualityControl): JsonResponse
    {
        $data = $request->validate([
            'defect_type'     => 'sometimes|in:stitching_error,color_difference,torn_fabric,print_error,none',
            'description'     => 'nullable|string',
            'defect_quantity' => 'sometimes|integer|min:0',
            'passed_quantity' => 'sometimes|integer|min:0',
            'result'          => 'sometimes|in:passed,failed,partial',
        ]);

        $qc = $this->qcService->update($qualityControl, $data);
        return response()->json(new QualityControlResource($qc));
    }

    public function destroy(QualityControl $qualityControl): JsonResponse
    {
        $this->qcService->delete($qualityControl);
        return response()->json(null, 204);
    }

    public function stats(): JsonResponse
    {
        return response()->json($this->qcService->getDefectStats());
    }
}
