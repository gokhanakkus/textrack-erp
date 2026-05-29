<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function __construct(private DashboardService $dashboardService) {}

    public function index(): JsonResponse
    {
        return response()->json([
            'stats'               => $this->dashboardService->getStats(),
            'weekly_production'   => $this->dashboardService->getWeeklyProduction(),
            'monthly_efficiency'  => $this->dashboardService->getMonthlyEfficiency(),
            'defect_distribution' => $this->dashboardService->getDefectDistribution(),
        ]);
    }
}
