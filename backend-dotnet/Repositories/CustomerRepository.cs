using Microsoft.EntityFrameworkCore;
using TexTrack.Api.Data;
using TexTrack.Api.Infrastructure;
using TexTrack.Api.Models;

namespace TexTrack.Api.Repositories;

public class CustomerRepository
{
    private readonly AppDbContext _db;
    public CustomerRepository(AppDbContext db) => _db = db;

    // orders_count ile birlikte sayfalı liste
    public async Task<PagedResult<(Customer Customer, int OrdersCount)>> PaginateAsync(
        IReadOnlyDictionary<string, string?> filters)
    {
        var query = _db.Customers
            .Select(c => new { Customer = c, OrdersCount = c.Orders.Count() })
            .OrderByDescending(x => x.Customer.Id)
            .AsQueryable();

        if (filters.TryGetValue("search", out var search) && !string.IsNullOrEmpty(search))
        {
            query = query.Where(x =>
                EF.Functions.Like(x.Customer.Name, $"%{search}%") ||
                (x.Customer.ContactPerson != null && EF.Functions.Like(x.Customer.ContactPerson, $"%{search}%")) ||
                (x.Customer.Email != null && EF.Functions.Like(x.Customer.Email, $"%{search}%")));
        }

        var paged = await query.PaginateAsync(filters);
        return new PagedResult<(Customer, int)>
        {
            Items = paged.Items.Select(x => (x.Customer, x.OrdersCount)).ToList(),
            Meta = paged.Meta,
        };
    }

    public Task<List<Customer>> AllAsync() =>
        _db.Customers.OrderBy(c => c.Name).ToListAsync();

    public async Task<(Customer Customer, int OrdersCount)> FindAsync(long id)
    {
        var customer = await _db.Customers.FirstOrDefaultAsync(c => c.Id == id)
            ?? throw new NotFoundException("Customer not found");
        var count = await _db.Orders.CountAsync(o => o.CustomerId == id);
        return (customer, count);
    }

    public async Task<Customer> CreateAsync(Customer customer)
    {
        _db.Customers.Add(customer);
        await _db.SaveChangesAsync();
        return customer;
    }

    public async Task<Customer> UpdateAsync(Customer customer)
    {
        await _db.SaveChangesAsync();
        return customer;
    }

    public async Task DeleteAsync(Customer customer)
    {
        _db.Customers.Remove(customer);
        await _db.SaveChangesAsync();
    }

    public Task<Customer?> GetAsync(long id) =>
        _db.Customers.FirstOrDefaultAsync(c => c.Id == id);
}
