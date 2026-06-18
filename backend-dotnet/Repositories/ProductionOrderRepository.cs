using Microsoft.EntityFrameworkCore;
using TexTrack.Api.Data;
using TexTrack.Api.Infrastructure;
using TexTrack.Api.Models;

namespace TexTrack.Api.Repositories;

public class ProductionOrderRepository
{
    private readonly AppDbContext _db;
    public ProductionOrderRepository(AppDbContext db) => _db = db;

    public Task<PagedResult<ProductionOrder>> PaginateAsync(IReadOnlyDictionary<string, string?> filters)
    {
        var query = _db.ProductionOrders
            .Include(p => p.Order).Include(p => p.Stock)
            .OrderByDescending(p => p.Id).AsQueryable();

        if (filters.TryGetValue("status", out var status) && !string.IsNullOrEmpty(status))
            query = query.Where(p => p.Status == status);

        if (filters.TryGetValue("production_line", out var line) && !string.IsNullOrEmpty(line))
            query = query.Where(p => p.ProductionLine == line);

        return query.PaginateAsync(filters);
    }

    public async Task<ProductionOrder> CreateAsync(ProductionOrder production)
    {
        _db.ProductionOrders.Add(production);
        await _db.SaveChangesAsync();
        return production;
    }

    public async Task<ProductionOrder> UpdateAsync(ProductionOrder production)
    {
        await _db.SaveChangesAsync();
        await _db.Entry(production).Reference(p => p.Order).LoadAsync();
        await _db.Entry(production).Reference(p => p.Stock).LoadAsync();
        return production;
    }

    public async Task DeleteAsync(ProductionOrder production)
    {
        _db.ProductionOrders.Remove(production);
        await _db.SaveChangesAsync();
    }

    public Task<ProductionOrder?> GetAsync(long id, bool withOrder = false, bool withStock = false, bool withQc = false)
    {
        var query = _db.ProductionOrders.AsQueryable();
        if (withOrder) query = query.Include(p => p.Order);
        if (withStock) query = query.Include(p => p.Stock);
        if (withQc) query = query.Include(p => p.QualityControls);
        return query.FirstOrDefaultAsync(p => p.Id == id);
    }
}
