using Microsoft.EntityFrameworkCore;
using TexTrack.Api.Data;
using TexTrack.Api.Dtos;
using TexTrack.Api.Infrastructure;
using TexTrack.Api.Models;
using TexTrack.Api.Repositories;

namespace TexTrack.Api.Services;

public class QualityControlService
{
    private readonly QualityControlRepository _repo;
    private readonly AppContextExists _exists;
    private readonly AppDbContext _db;

    public QualityControlService(QualityControlRepository repo, AppContextExists exists, AppDbContext db)
    {
        _repo = repo;
        _exists = exists;
        _db = db;
    }

    public Task<PagedResult<QualityControl>> ListAsync(IReadOnlyDictionary<string, string?> filters) =>
        _repo.PaginateAsync(filters);

    public Task<QualityControl?> GetAsync(long id, bool withProductionOrder = false) =>
        _repo.GetAsync(id, withProductionOrder);

    public async Task<QualityControl> CreateAsync(StoreQualityControlRequest data)
    {
        new Validator()
            .Required("production_order_id", data.ProductionOrderId)
            .RequiredString("defect_type", data.DefectType)
            .In("defect_type", data.DefectType, "stitching_error", "color_difference", "torn_fabric", "print_error", "none")
            .Required("defect_quantity", data.DefectQuantity).IntMin("defect_quantity", data.DefectQuantity, 0)
            .Required("passed_quantity", data.PassedQuantity).IntMin("passed_quantity", data.PassedQuantity, 0)
            .RequiredString("result", data.Result).In("result", data.Result, "passed", "failed", "partial")
            .Check();

        if (!await _exists.ProductionOrderExists(data.ProductionOrderId!.Value))
            throw new ValidationException(new() { ["production_order_id"] = new[] { "The selected production order id is invalid." } });

        var qc = new QualityControl
        {
            ProductionOrderId = data.ProductionOrderId!.Value,
            DefectType = data.DefectType!,
            Description = data.Description,
            DefectQuantity = data.DefectQuantity!.Value,
            PassedQuantity = data.PassedQuantity!.Value,
            Result = data.Result!,
        };
        return await _repo.CreateAsync(qc);
    }

    public Task<QualityControl> UpdateAsync(QualityControl qc, UpdateQualityControlRequest data)
    {
        new Validator()
            .In("defect_type", data.DefectType, "stitching_error", "color_difference", "torn_fabric", "print_error", "none")
            .IntMin("defect_quantity", data.DefectQuantity, 0)
            .IntMin("passed_quantity", data.PassedQuantity, 0)
            .In("result", data.Result, "passed", "failed", "partial")
            .Check();

        if (data.DefectType != null) qc.DefectType = data.DefectType;
        if (data.Description != null) qc.Description = data.Description;
        if (data.DefectQuantity != null) qc.DefectQuantity = data.DefectQuantity.Value;
        if (data.PassedQuantity != null) qc.PassedQuantity = data.PassedQuantity.Value;
        if (data.Result != null) qc.Result = data.Result;
        return _repo.UpdateAsync(qc);
    }

    public Task DeleteAsync(QualityControl qc) => _repo.DeleteAsync(qc);

    public async Task<object> GetDefectStatsAsync()
    {
        var byType = await _db.QualityControls
            .Where(q => q.DefectType != "none")
            .GroupBy(q => q.DefectType)
            .Select(g => new { defect_type = g.Key, total = g.Sum(x => x.DefectQuantity) })
            .ToListAsync();

        var byResult = await _db.QualityControls
            .GroupBy(q => q.Result)
            .Select(g => new { result = g.Key, count = g.Count() })
            .ToListAsync();

        int totalDefects = byType.Sum(x => x.total);
        int totalInspected = await _db.QualityControls
            .SumAsync(q => (int?)(q.DefectQuantity + q.PassedQuantity)) ?? 0;

        return new
        {
            by_type = byType,
            by_result = byResult,
            total_defects = totalDefects,
            defect_rate = totalInspected > 0
                ? Math.Round((double)totalDefects / totalInspected * 100, 2)
                : 0,
        };
    }
}
