using Microsoft.EntityFrameworkCore;
using TexTrack.Api.Data;

namespace TexTrack.Api.Services;

// Laravel'in `exists:table,id` doğrulama kuralı karşılığı.
public class AppContextExists
{
    private readonly AppDbContext _db;
    public AppContextExists(AppDbContext db) => _db = db;

    public Task<bool> ProductExists(long id) => _db.Products.AnyAsync(p => p.Id == id);
    public Task<bool> OrderExists(long id) => _db.Orders.AnyAsync(o => o.Id == id);
    public Task<bool> StockExists(long id) => _db.Stocks.AnyAsync(s => s.Id == id);
    public Task<bool> ProductionOrderExists(long id) => _db.ProductionOrders.AnyAsync(p => p.Id == id);
}
