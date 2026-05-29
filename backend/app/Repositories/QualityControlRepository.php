<?php

namespace App\Repositories;

use App\Models\QualityControl;
use Illuminate\Pagination\LengthAwarePaginator;

class QualityControlRepository
{
    public function paginate(array $filters): LengthAwarePaginator
    {
        $query = QualityControl::with(['productionOrder.order'])->latest();

        if (!empty($filters['defect_type'])) {
            $query->where('defect_type', $filters['defect_type']);
        }

        if (!empty($filters['result'])) {
            $query->where('result', $filters['result']);
        }

        return $query->paginate($filters['per_page'] ?? 15);
    }

    public function create(array $data): QualityControl
    {
        return QualityControl::create($data);
    }

    public function update(QualityControl $qc, array $data): QualityControl
    {
        $qc->update($data);
        return $qc->fresh(['productionOrder']);
    }

    public function delete(QualityControl $qc): void
    {
        $qc->delete();
    }
}
