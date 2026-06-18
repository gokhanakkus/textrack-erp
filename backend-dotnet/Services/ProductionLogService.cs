using Microsoft.EntityFrameworkCore;
using TexTrack.Api.Auth;
using TexTrack.Api.Data;
using TexTrack.Api.Dtos;
using TexTrack.Api.Infrastructure;
using TexTrack.Api.Models;

namespace TexTrack.Api.Services;

public class ProductionLogService
{
    private readonly AppDbContext _db;
    private readonly CurrentUser _currentUser;

    public ProductionLogService(AppDbContext db, CurrentUser currentUser)
    {
        _db = db;
        _currentUser = currentUser;
    }

    public Task<List<ProductionLog>> GetForOrderAsync(ProductionOrder production) =>
        _db.ProductionLogs.Include(l => l.User)
            .Where(l => l.ProductionOrderId == production.Id)
            .OrderBy(l => l.Date).ThenBy(l => l.Shift)
            .ToListAsync();

    public async Task<ProductionLog> CreateAsync(ProductionOrder production, StoreProductionLogRequest data)
    {
        new Validator()
            .RequiredString("date", data.Date).Date("date", data.Date)
            .RequiredString("shift", data.Shift).In("shift", data.Shift, "sabah", "öğle", "gece")
            .Required("produced_quantity", data.ProducedQuantity).IntMin("produced_quantity", data.ProducedQuantity, 1)
            .Check();

        var log = new ProductionLog
        {
            ProductionOrderId = production.Id,
            UserId = _currentUser.Id,
            Date = Validator.ParseDate(data.Date!),
            Shift = data.Shift!,
            ProducedQuantity = data.ProducedQuantity!.Value,
            Notes = data.Notes,
        };
        _db.ProductionLogs.Add(log);
        await _db.SaveChangesAsync();

        await RecalculateProgressAsync(production);

        await _db.Entry(log).Reference(l => l.User).LoadAsync();
        return log;
    }

    public async Task<ProductionLog> UpdateAsync(ProductionLog log, UpdateProductionLogRequest data)
    {
        new Validator()
            .Date("date", data.Date)
            .In("shift", data.Shift, "sabah", "öğle", "gece")
            .IntMin("produced_quantity", data.ProducedQuantity, 1)
            .Check();

        if (data.Date != null) log.Date = Validator.ParseDate(data.Date);
        if (data.Shift != null) log.Shift = data.Shift;
        if (data.ProducedQuantity != null) log.ProducedQuantity = data.ProducedQuantity.Value;
        if (data.Notes != null) log.Notes = data.Notes;
        await _db.SaveChangesAsync();

        var production = await _db.ProductionOrders.FirstAsync(p => p.Id == log.ProductionOrderId);
        await RecalculateProgressAsync(production);

        await _db.Entry(log).Reference(l => l.User).LoadAsync();
        return log;
    }

    public async Task DeleteAsync(ProductionLog log)
    {
        var production = await _db.ProductionOrders.FirstAsync(p => p.Id == log.ProductionOrderId);
        _db.ProductionLogs.Remove(log);
        await _db.SaveChangesAsync();
        await RecalculateProgressAsync(production);
    }

    public Task<ProductionLog?> GetAsync(long id) =>
        _db.ProductionLogs.FirstOrDefaultAsync(l => l.Id == id);

    // Tüm logların toplamından progress_percentage hesapla. Hedef: siparişteki quantity.
    private async Task RecalculateProgressAsync(ProductionOrder production)
    {
        var order = await _db.Orders.FirstOrDefaultAsync(o => o.Id == production.OrderId);
        int target = order?.Quantity ?? 0;
        if (target <= 0) return;

        int totalProduced = await _db.ProductionLogs
            .Where(l => l.ProductionOrderId == production.Id)
            .SumAsync(l => (int?)l.ProducedQuantity) ?? 0;

        int percentage = Math.Min(100, (int)Math.Round(totalProduced / (double)target * 100));
        production.ProgressPercentage = percentage;
        await _db.SaveChangesAsync();
    }
}
