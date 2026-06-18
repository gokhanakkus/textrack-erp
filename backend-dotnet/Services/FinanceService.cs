using Microsoft.EntityFrameworkCore;
using TexTrack.Api.Data;
using TexTrack.Api.Dtos;
using TexTrack.Api.Infrastructure;
using TexTrack.Api.Models;

namespace TexTrack.Api.Services;

public class FinanceService
{
    private readonly AppDbContext _db;
    public FinanceService(AppDbContext db) => _db = db;

    public async Task<object> GetStatsAsync()
    {
        var orders = await _db.Orders
            .Where(o => o.UnitPrice != null && o.UnitCost != null)
            .Select(o => new { o.Quantity, o.UnitPrice, o.UnitCost, o.Status, o.CreatedAt })
            .ToListAsync();

        decimal totalRevenue = orders.Sum(o => o.Quantity * o.UnitPrice!.Value);
        decimal totalCost = orders.Sum(o => o.Quantity * o.UnitCost!.Value);
        decimal totalProfit = totalRevenue - totalCost;
        double margin = totalRevenue > 0 ? Math.Round((double)(totalProfit / totalRevenue) * 100, 1) : 0;

        var since = DateTime.UtcNow.AddMonths(-11);
        var firstOfMonth = new DateTime(since.Year, since.Month, 1);

        var monthly = orders
            .Where(o => o.CreatedAt >= firstOfMonth)
            .GroupBy(o => o.CreatedAt.ToString("yyyy-MM"))
            .OrderBy(g => g.Key)
            .Select(g => new
            {
                month = g.Key,
                revenue = Math.Round((double)g.Sum(o => o.Quantity * o.UnitPrice!.Value), 2),
                cost = Math.Round((double)g.Sum(o => o.Quantity * o.UnitCost!.Value), 2),
                profit = Math.Round((double)g.Sum(o => o.Quantity * (o.UnitPrice!.Value - o.UnitCost!.Value)), 2),
            })
            .ToList();

        var byStatus = orders
            .GroupBy(o => o.Status)
            .Select(g => new
            {
                status = g.Key,
                revenue = Math.Round((double)g.Sum(o => o.Quantity * o.UnitPrice!.Value), 2),
                profit = Math.Round((double)g.Sum(o => o.Quantity * (o.UnitPrice!.Value - o.UnitCost!.Value)), 2),
                count = g.Count(),
            })
            .ToList();

        return new
        {
            summary = new
            {
                total_revenue = Math.Round((double)totalRevenue, 2),
                total_cost = Math.Round((double)totalCost, 2),
                total_profit = Math.Round((double)totalProfit, 2),
                margin,
                order_count = orders.Count,
            },
            monthly,
            by_status = byStatus,
        };
    }

    public async Task<object> GetOrdersAsync(IReadOnlyDictionary<string, string?> filters)
    {
        var query = _db.Orders
            .Include(o => o.Customer)
            .Where(o => o.UnitPrice != null && o.UnitCost != null)
            .OrderByDescending(o => o.CreatedAt);

        var paged = await query.PaginateAsync(filters, 15);

        var items = paged.Items.Select(o =>
        {
            decimal revenue = o.Quantity * o.UnitPrice!.Value;
            decimal cost = o.Quantity * o.UnitCost!.Value;
            decimal profit = revenue - cost;
            double margin = revenue > 0 ? Math.Round((double)(profit / revenue) * 100, 1) : 0;
            return new
            {
                id = o.Id,
                customer_name = o.Customer?.Name ?? o.CustomerName,
                product_type = o.ProductType,
                quantity = o.Quantity,
                unit_price = (double)o.UnitPrice!.Value,
                unit_cost = (double)o.UnitCost!.Value,
                revenue = Math.Round((double)revenue, 2),
                cost = Math.Round((double)cost, 2),
                profit = Math.Round((double)profit, 2),
                margin,
                status = o.Status,
                delivery_date = o.DeliveryDate.ToString("yyyy-MM-dd"),
            };
        }).ToList();

        return new
        {
            data = items,
            meta = new
            {
                total = paged.Meta.Total,
                current_page = paged.Meta.CurrentPage,
                last_page = paged.Meta.LastPage,
                per_page = paged.Meta.PerPage,
            },
        };
    }
}
