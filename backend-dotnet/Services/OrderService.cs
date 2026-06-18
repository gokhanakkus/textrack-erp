using TexTrack.Api.Auth;
using TexTrack.Api.Dtos;
using TexTrack.Api.Infrastructure;
using TexTrack.Api.Models;
using TexTrack.Api.Repositories;

namespace TexTrack.Api.Services;

public class OrderService
{
    private readonly OrderRepository _repo;
    private readonly CurrentUser _currentUser;

    public OrderService(OrderRepository repo, CurrentUser currentUser)
    {
        _repo = repo;
        _currentUser = currentUser;
    }

    public Task<PagedResult<Order>> ListAsync(IReadOnlyDictionary<string, string?> filters) =>
        _repo.PaginateAsync(filters);

    public Task<Order?> FindAsync(long id, bool withRelations = false) =>
        _repo.FindAsync(id, withRelations);

    public Task<Order> CreateAsync(StoreOrderRequest data)
    {
        new Validator()
            .RequiredString("customer_name", data.CustomerName).Max("customer_name", data.CustomerName, 255)
            .RequiredString("product_type", data.ProductType).Max("product_type", data.ProductType, 255)
            .RequiredString("color", data.Color).Max("color", data.Color, 100)
            .RequiredString("size", data.Size).Max("size", data.Size, 50)
            .Required("quantity", data.Quantity).IntMin("quantity", data.Quantity, 1)
            .RequiredString("delivery_date", data.DeliveryDate).Date("delivery_date", data.DeliveryDate)
            .Check();

        var order = new Order
        {
            UserId = _currentUser.Id ?? 0,
            CustomerName = data.CustomerName!,
            ProductType = data.ProductType!,
            Color = data.Color!,
            Size = data.Size!,
            Quantity = data.Quantity!.Value,
            DeliveryDate = Validator.ParseDate(data.DeliveryDate!),
            Notes = data.Notes,
            Status = "Pending",
        };
        return _repo.CreateAsync(order);
    }

    public Task<Order> UpdateAsync(Order order, UpdateOrderRequest data)
    {
        new Validator()
            .Max("customer_name", data.CustomerName, 255)
            .Max("product_type", data.ProductType, 255)
            .Max("color", data.Color, 100)
            .Max("size", data.Size, 50)
            .IntMin("quantity", data.Quantity, 1)
            .Date("delivery_date", data.DeliveryDate)
            .In("status", data.Status, "Pending", "In Production", "Quality Control", "Completed", "Delayed")
            .Check();

        if (data.CustomerName != null) order.CustomerName = data.CustomerName;
        if (data.ProductType != null) order.ProductType = data.ProductType;
        if (data.Color != null) order.Color = data.Color;
        if (data.Size != null) order.Size = data.Size;
        if (data.Quantity != null) order.Quantity = data.Quantity.Value;
        if (data.DeliveryDate != null) order.DeliveryDate = Validator.ParseDate(data.DeliveryDate);
        if (data.Status != null) order.Status = data.Status;
        if (data.Notes != null) order.Notes = data.Notes;

        return _repo.UpdateAsync(order);
    }

    public Task DeleteAsync(Order order) => _repo.DeleteAsync(order);
}
