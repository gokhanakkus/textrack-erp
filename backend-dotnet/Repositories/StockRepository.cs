using Microsoft.EntityFrameworkCore;
using TexTrack.Api.Data;
using TexTrack.Api.Infrastructure;
using TexTrack.Api.Models;

namespace TexTrack.Api.Repositories;

public class StockRepository
{
    private readonly AppDbContext _db;
    public StockRepository(AppDbContext db) => _db = db;

    public Task<PagedResult<Stock>> PaginateAsync(IReadOnlyDictionary<string, string?> filters)
    {
        var query = _db.Stocks.Include(s => s.Product).OrderByDescending(s => s.Id).AsQueryable();

        if (filters.TryGetValue("fabric_type", out var fabric) && !string.IsNullOrEmpty(fabric))
            query = query.Where(s => s.FabricType == fabric);

        if (filters.TryGetValue("critical", out var critical) && !string.IsNullOrEmpty(critical))
            query = query.Where(s => s.QuantityMeter < s.CriticalLevel);

        if (filters.TryGetValue("search", out var search) && !string.IsNullOrEmpty(search))
            query = query.Where(s =>
                EF.Functions.Like(s.FabricType, $"%{search}%") ||
                EF.Functions.Like(s.Color, $"%{search}%"));

        return query.PaginateAsync(filters);
    }

    public async Task<Stock> CreateAsync(Stock stock)
    {
        _db.Stocks.Add(stock);
        await _db.SaveChangesAsync();
        await _db.Entry(stock).Reference(s => s.Product).LoadAsync();
        return stock;
    }

    public async Task<Stock> UpdateAsync(Stock stock)
    {
        await _db.SaveChangesAsync();
        await _db.Entry(stock).Reference(s => s.Product).LoadAsync();
        return stock;
    }

    public async Task DeleteAsync(Stock stock)
    {
        _db.Stocks.Remove(stock);
        await _db.SaveChangesAsync();
    }

    public Task<List<Stock>> GetCriticalAsync() =>
        _db.Stocks.Include(s => s.Product)
            .Where(s => s.QuantityMeter < s.CriticalLevel)
            .ToListAsync();

    public Task<Stock?> GetAsync(long id, bool withProduct = false)
    {
        IQueryable<Stock> query = _db.Stocks;
        if (withProduct) query = query.Include(s => s.Product);
        return query.FirstOrDefaultAsync(s => s.Id == id);
    }
}
