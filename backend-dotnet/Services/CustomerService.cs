using TexTrack.Api.Dtos;
using TexTrack.Api.Infrastructure;
using TexTrack.Api.Models;
using TexTrack.Api.Repositories;

namespace TexTrack.Api.Services;

public class CustomerService
{
    private readonly CustomerRepository _repo;
    public CustomerService(CustomerRepository repo) => _repo = repo;

    public Task<PagedResult<(Customer Customer, int OrdersCount)>> ListAsync(
        IReadOnlyDictionary<string, string?> filters) => _repo.PaginateAsync(filters);

    public Task<List<Customer>> AllAsync() => _repo.AllAsync();

    public Task<(Customer Customer, int OrdersCount)> FindAsync(long id) => _repo.FindAsync(id);

    public Task<Customer> CreateAsync(CustomerRequest data)
    {
        Validate(data, isCreate: true);
        var customer = new Customer
        {
            Name = data.Name!,
            ContactPerson = data.ContactPerson,
            Email = data.Email,
            Phone = data.Phone,
            City = data.City,
            Address = data.Address,
            TaxNo = data.TaxNo,
        };
        return _repo.CreateAsync(customer);
    }

    public Task<Customer> UpdateAsync(Customer customer, CustomerRequest data)
    {
        Validate(data, isCreate: false);
        if (data.Name != null) customer.Name = data.Name;
        if (data.ContactPerson != null) customer.ContactPerson = data.ContactPerson;
        if (data.Email != null) customer.Email = data.Email;
        if (data.Phone != null) customer.Phone = data.Phone;
        if (data.City != null) customer.City = data.City;
        if (data.Address != null) customer.Address = data.Address;
        if (data.TaxNo != null) customer.TaxNo = data.TaxNo;
        return _repo.UpdateAsync(customer);
    }

    public Task<Customer?> GetAsync(long id) => _repo.GetAsync(id);

    public Task DeleteAsync(Customer customer) => _repo.DeleteAsync(customer);

    private static void Validate(CustomerRequest data, bool isCreate)
    {
        var v = new Validator();
        if (isCreate) v.RequiredString("name", data.Name);
        v.Max("name", data.Name, 255)
            .Max("contact_person", data.ContactPerson, 255)
            .Email("email", data.Email).Max("email", data.Email, 255)
            .Max("phone", data.Phone, 30)
            .Max("city", data.City, 100)
            .Max("tax_no", data.TaxNo, 20)
            .Check();
    }
}
