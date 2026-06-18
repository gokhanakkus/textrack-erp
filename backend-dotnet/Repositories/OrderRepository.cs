using Microsoft.EntityFrameworkCore;
using TexTrack.Api.Data;
using TexTrack.Api.Infrastructure;
using TexTrack.Api.Models;

namespace TexTrack.Api.Repositories;

public class OrderRepository
{
    private readonly AppDbContext _db;
    public OrderRepository(AppDbContext db) => _db = db;

    public Task<PagedResult<Order>> PaginateAsync(IReadOnlyDictionary<string, string?> filters)
    {
        var query = _db.Orders.Include(o => o.User).OrderByDescending(o => o.Id).AsQueryable();

        if (filters.TryGetValue("status", out var status) && !string.IsNullOrEmpty(status))
            query = query.Where(o => o.Status == status);

        if (filters.TryGetValue("search", out var search) && !string.IsNullOrEmpty(search))
            query = query.Where(o => EF.Functions.Like(o.CustomerName, $"%{search}%"));

        if (filters.TryGetValue("from", out var from) && Validator.TryParseDate(from ?? "", out var fromDate))
            query = query.Where(o => o.DeliveryDate >= fromDate);

        if (filters.TryGetValue("to", out var to) && Validator.TryParseDate(to ?? "", out var toDate))
            query = query.Where(o => o.DeliveryDate <= toDate);

        return query.PaginateAsync(filters);
    }

    public async Task<Order> CreateAsync(Order order)
    {
        _db.Orders.Add(order);
        await _db.SaveChangesAsync();
        return order;
    }

    public async Task<Order> UpdateAsync(Order order)
    {
        await _db.SaveChangesAsync();
        return order;
    }

    public async Task DeleteAsync(Order order)
    {
        _db.Orders.Remove(order);
        await _db.SaveChangesAsync();
    }

    public Task<Order?> FindAsync(long id, bool withRelations = false)
    {
        var query = _db.Orders.AsQueryable();
        if (withRelations)
            query = query.Include(o => o.User).Include(o => o.ProductionOrder);
        return query.FirstOrDefaultAsync(o => o.Id == id);
    }
}
