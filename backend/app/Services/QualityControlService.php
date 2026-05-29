<?php

namespace App\Services;

use App\Models\QualityControl;
use App\Repositories\QualityControlRepository;
use Illuminate\Support\Facades\DB;

class QualityControlService
{
    public function __construct(private QualityControlRepository $repo) {}

    public function list(array $filters)
    {
        return $this->repo->paginate($filters);
    }

    public function create(array $data): QualityControl
    {
        return $this->repo->create($data);
    }

    public function update(QualityControl $qc, array $data): QualityControl
    {
        return $this->repo->update($qc, $data);
    }

    public function delete(QualityControl $qc): void
    {
        $this->repo->delete($qc);
    }

    public function getDefectStats(): array
    {
        $byType = DB::table('quality_controls')
            ->select('defect_type', DB::raw('SUM(defect_quantity) as total'))
            ->where('defect_type', '!=', 'none')
            ->groupBy('defect_type')
            ->get();

        $byResult = DB::table('quality_controls')
            ->select('result', DB::raw('COUNT(*) as count'))
            ->groupBy('result')
            ->get();

        $totalDefects = $byType->sum('total');
        $totalInspected = DB::table('quality_controls')
            ->sum(DB::raw('defect_quantity + passed_quantity'));

        return [
            'by_type' => $byType,
            'by_result' => $byResult,
            'total_defects' => $totalDefects,
            'defect_rate' => $totalInspected > 0
                ? round(($totalDefects / $totalInspected) * 100, 2)
                : 0,
        ];
    }
}
