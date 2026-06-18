using Microsoft.EntityFrameworkCore;
using TexTrack.Api.Data;
using TexTrack.Api.Infrastructure;
using TexTrack.Api.Models;

namespace TexTrack.Api.Repositories;

public class QualityControlRepository
{
    private readonly AppDbContext _db;
    public QualityControlRepository(AppDbContext db) => _db = db;

    public Task<PagedResult<QualityControl>> PaginateAsync(IReadOnlyDictionary<string, string?> filters)
    {
        var query = _db.QualityControls
            .Include(q => q.ProductionOrder).ThenInclude(p => p!.Order)
            .OrderByDescending(q => q.Id).AsQueryable();

        if (filters.TryGetValue("defect_type", out var defect) && !string.IsNullOrEmpty(defect))
            query = query.Where(q => q.DefectType == defect);

        if (filters.TryGetValue("result", out var result) && !string.IsNullOrEmpty(result))
            query = query.Where(q => q.Result == result);

        return query.PaginateAsync(filters);
    }

    public async Task<QualityControl> CreateAsync(QualityControl qc)
    {
        _db.QualityControls.Add(qc);
        await _db.SaveChangesAsync();
        return qc;
    }

    public async Task<QualityControl> UpdateAsync(QualityControl qc)
    {
        await _db.SaveChangesAsync();
        await _db.Entry(qc).Reference(q => q.ProductionOrder).LoadAsync();
        return qc;
    }

    public async Task DeleteAsync(QualityControl qc)
    {
        _db.QualityControls.Remove(qc);
        await _db.SaveChangesAsync();
    }

    public Task<QualityControl?> GetAsync(long id, bool withProductionOrder = false)
    {
        var query = _db.QualityControls.AsQueryable();
        if (withProductionOrder)
            query = query.Include(q => q.ProductionOrder).ThenInclude(p => p!.Order);
        return query.FirstOrDefaultAsync(q => q.Id == id);
    }
}
