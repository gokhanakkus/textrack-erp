using TexTrack.Api.Dtos;
using TexTrack.Api.Infrastructure;
using TexTrack.Api.Models;
using TexTrack.Api.Repositories;

namespace TexTrack.Api.Services;

public class StockService
{
    private readonly StockRepository _repo;
    private readonly NotificationService _notifications;
    private readonly AppContextExists _exists;

    public StockService(StockRepository repo, NotificationService notifications, AppContextExists exists)
    {
        _repo = repo;
        _notifications = notifications;
        _exists = exists;
    }

    public Task<PagedResult<Stock>> ListAsync(IReadOnlyDictionary<string, string?> filters) =>
        _repo.PaginateAsync(filters);

    public async Task<Stock> CreateAsync(StoreStockRequest data)
    {
        await ValidateAsync(data, isCreate: true);
        var stock = new Stock
        {
            ProductId = data.ProductId!.Value,
            FabricType = data.FabricType!,
            Color = data.Color!,
            QuantityMeter = data.QuantityMeter!.Value,
            CriticalLevel = data.CriticalLevel!.Value,
        };
        stock = await _repo.CreateAsync(stock);
        await CheckCriticalAsync(stock);
        return stock;
    }

    public async Task<Stock> UpdateAsync(Stock stock, StoreStockRequest data)
    {
        await ValidateAsync(data, isCreate: true); // StoreStockRequest tüm alanları required
        stock.ProductId = data.ProductId!.Value;
        stock.FabricType = data.FabricType!;
        stock.Color = data.Color!;
        stock.QuantityMeter = data.QuantityMeter!.Value;
        stock.CriticalLevel = data.CriticalLevel!.Value;
        stock = await _repo.UpdateAsync(stock);
        await CheckCriticalAsync(stock);
        return stock;
    }

    public Task DeleteAsync(Stock stock) => _repo.DeleteAsync(stock);

    public Task<List<Stock>> GetCriticalStocksAsync() => _repo.GetCriticalAsync();

    public Task<Stock?> GetAsync(long id, bool withProduct = false) => _repo.GetAsync(id, withProduct);

    private async Task CheckCriticalAsync(Stock stock)
    {
        if (stock.QuantityMeter < stock.CriticalLevel)
        {
            await _notifications.CreateAsync(
                "Kritik Stok Uyarısı",
                $"\"{stock.FabricType} - {stock.Color}\" stoku kritik seviyenin altında ({stock.QuantityMeter}m / {stock.CriticalLevel}m eşiği).",
                "critical_stock");
        }
    }

    private async Task ValidateAsync(StoreStockRequest data, bool isCreate)
    {
        var v = new Validator()
            .Required("product_id", data.ProductId)
            .RequiredString("fabric_type", data.FabricType).Max("fabric_type", data.FabricType, 100)
            .RequiredString("color", data.Color).Max("color", data.Color, 100)
            .Required("quantity_meter", data.QuantityMeter).DecimalMin("quantity_meter", data.QuantityMeter, 0)
            .Required("critical_level", data.CriticalLevel).DecimalMin("critical_level", data.CriticalLevel, 0);
        v.Check();

        if (!await _exists.ProductExists(data.ProductId!.Value))
            throw new ValidationException(new() { ["product_id"] = new[] { "The selected product id is invalid." } });
    }
}
