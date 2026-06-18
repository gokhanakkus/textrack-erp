using Microsoft.EntityFrameworkCore;
using TexTrack.Api.Data;

namespace TexTrack.Api.Services;

public class DashboardService
{
    private readonly AppDbContext _db;
    public DashboardService(AppDbContext db) => _db = db;

    private static readonly string[] ActiveStatuses = { "Pending", "In Production", "Quality Control" };

    public async Task<object> GetStatsAsync()
    {
        return new
        {
            total_orders = await _db.Orders.CountAsync(),
            active_orders = await _db.Orders.CountAsync(o => ActiveStatuses.Contains(o.Status)),
            delayed_orders = await _db.Orders.CountAsync(o => o.Status == "Delayed"),
            completed_orders = await _db.Orders.CountAsync(o => o.Status == "Completed"),
            critical_stocks = await _db.Stocks.CountAsync(s => s.QuantityMeter < s.CriticalLevel),
            running_productions = await _db.ProductionOrders.CountAsync(p => p.Status == "Running"),
            defect_rate = await GetDefectRateAsync(),
            production_efficiency = await GetProductionEfficiencyAsync(),
        };
    }

    public async Task<object> GetWeeklyProductionAsync()
    {
        var since = DateTime.UtcNow.AddDays(-7);
        var rows = await _db.ProductionOrders
            .Where(p => p.CreatedAt >= since)
            .Select(p => p.CreatedAt)
            .ToListAsync();

        return rows
            .GroupBy(d => d.ToString("yyyy-MM-dd"))
            .OrderBy(g => g.Key)
            .Select(g => new { date = g.Key, count = g.Count() })
            .ToList();
    }

    public async Task<object> GetMonthlyEfficiencyAsync()
    {
        var since = DateTime.UtcNow.AddMonths(-6);
        var rows = await _db.ProductionOrders
            .Where(p => p.CreatedAt >= since)
            .Select(p => new { p.CreatedAt, p.ProgressPercentage })
            .ToListAsync();

        return rows
            .GroupBy(r => r.CreatedAt.ToString("yyyy-MM"))
            .OrderBy(g => g.Key)
            .Select(g => new { month = g.Key, efficiency = Math.Round(g.Average(x => x.ProgressPercentage), 1) })
            .ToList();
    }

    public async Task<object> GetDefectDistributionAsync()
    {
        var rows = await _db.QualityControls
            .Where(q => q.DefectType != "none")
            .GroupBy(q => q.DefectType)
            .Select(g => new { name = g.Key, value = g.Sum(x => x.DefectQuantity) })
            .ToListAsync();
        return rows;
    }

    private async Task<double> GetDefectRateAsync()
    {
        int total = await _db.QualityControls.SumAsync(q => (int?)(q.DefectQuantity + q.PassedQuantity)) ?? 0;
        int defects = await _db.QualityControls.SumAsync(q => (int?)q.DefectQuantity) ?? 0;
        return total > 0 ? Math.Round((double)defects / total * 100, 2) : 0;
    }

    private async Task<double> GetProductionEfficiencyAsync()
    {
        var avg = await _db.ProductionOrders.AverageAsync(p => (double?)p.ProgressPercentage) ?? 0;
        return Math.Round(avg, 1);
    }
}
