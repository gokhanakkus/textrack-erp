using Microsoft.EntityFrameworkCore;
using TexTrack.Api.Auth;
using TexTrack.Api.Data;
using TexTrack.Api.Dtos;
using TexTrack.Api.Infrastructure;
using TexTrack.Api.Models;
using TexTrack.Api.Repositories;

namespace TexTrack.Api.Services;

public class ProductionService
{
    private readonly ProductionOrderRepository _repo;
    private readonly NotificationService _notifications;
    private readonly AppContextExists _exists;
    private readonly AppDbContext _db;
    private readonly CurrentUser _currentUser;

    public ProductionService(ProductionOrderRepository repo, NotificationService notifications,
        AppContextExists exists, AppDbContext db, CurrentUser currentUser)
    {
        _repo = repo;
        _notifications = notifications;
        _exists = exists;
        _db = db;
        _currentUser = currentUser;
    }

    public Task<PagedResult<ProductionOrder>> ListAsync(IReadOnlyDictionary<string, string?> filters) =>
        _repo.PaginateAsync(filters);

    public Task<ProductionOrder?> GetAsync(long id, bool withOrder = false, bool withStock = false, bool withQc = false) =>
        _repo.GetAsync(id, withOrder, withStock, withQc);

    public async Task<ProductionOrder> CreateAsync(StoreProductionOrderRequest data)
    {
        await ValidateStoreAsync(data);

        Stock? stock = null;

        // ── Stok kontrolü ──
        if (data.StockId.HasValue && data.RequiredMeter.HasValue)
        {
            stock = await _db.Stocks.FirstOrDefaultAsync(s => s.Id == data.StockId.Value)
                ?? throw new NotFoundException("Stock not found");

            if (stock.QuantityMeter < data.RequiredMeter.Value)
                throw new ApiException(
                    $"Stok yetersiz! Mevcut: {stock.QuantityMeter}m, Gereken: {data.RequiredMeter.Value}m");
        }

        var production = new ProductionOrder
        {
            OrderId = data.OrderId!.Value,
            StockId = data.StockId,
            RequiredMeter = data.RequiredMeter,
            ProductionLine = data.ProductionLine!,
            StartDate = data.StartDate != null ? Validator.ParseDate(data.StartDate) : null,
            EndDate = data.EndDate != null ? Validator.ParseDate(data.EndDate) : null,
            Status = "Waiting",
            ProgressPercentage = 0,
            Notes = data.Notes,
        };
        production = await _repo.CreateAsync(production);

        // ── Stoktan düş + hareket logla ──
        if (stock != null && data.RequiredMeter.HasValue)
        {
            stock.QuantityMeter -= data.RequiredMeter.Value;

            _db.StockMovements.Add(new StockMovement
            {
                StockId = stock.Id,
                ProductionOrderId = production.Id,
                UserId = _currentUser.Id,
                Type = "out",
                QuantityMeter = data.RequiredMeter.Value,
                Reason = $"Üretim emri #{production.Id} için kullanıldı",
            });
            await _db.SaveChangesAsync();

            // Stok kritik seviyeye düştü mü?
            if (stock.QuantityMeter < stock.CriticalLevel)
            {
                await _notifications.CreateAsync(
                    "Kritik Stok Uyarısı",
                    $"\"{stock.FabricType} - {stock.Color}\" stoku kritik seviyenin altına düştü ({stock.QuantityMeter}m / {stock.CriticalLevel}m eşiği).",
                    "critical_stock");
            }
        }

        // ── Bağlı siparişin durumunu güncelle ──
        var order = await _db.Orders.FirstOrDefaultAsync(o => o.Id == production.OrderId);
        if (order != null)
        {
            order.Status = "In Production";
            await _db.SaveChangesAsync();
        }

        await _db.Entry(production).Reference(p => p.Order).LoadAsync();
        return production;
    }

    public async Task<ProductionOrder> UpdateAsync(ProductionOrder production, UpdateProductionOrderRequest data)
    {
        new Validator()
            .Max("production_line", data.ProductionLine, 100)
            .Date("start_date", data.StartDate)
            .Date("end_date", data.EndDate)
            .IntRange("progress_percentage", data.ProgressPercentage, 0, 100)
            .In("status", data.Status, "Waiting", "Running", "Paused", "Completed")
            .Check();

        if (data.ProductionLine != null) production.ProductionLine = data.ProductionLine;
        if (data.StartDate != null) production.StartDate = Validator.ParseDate(data.StartDate);
        if (data.EndDate != null) production.EndDate = Validator.ParseDate(data.EndDate);
        if (data.ProgressPercentage != null) production.ProgressPercentage = data.ProgressPercentage.Value;
        if (data.Status != null) production.Status = data.Status;
        if (data.Notes != null) production.Notes = data.Notes;

        production = await _repo.UpdateAsync(production);

        // Üretim tamamlandıysa siparişi kalite kontrole taşı
        if (data.Status == "Completed")
        {
            var order = await _db.Orders.FirstOrDefaultAsync(o => o.Id == production.OrderId);
            if (order != null)
            {
                order.Status = "Quality Control";
                await _db.SaveChangesAsync();
            }
        }

        return production;
    }

    public Task DeleteAsync(ProductionOrder production) => _repo.DeleteAsync(production);

    private async Task ValidateStoreAsync(StoreProductionOrderRequest data)
    {
        new Validator()
            .Required("order_id", data.OrderId)
            .DecimalMin("required_meter", data.RequiredMeter, 0.01m)
            .RequiredString("production_line", data.ProductionLine).Max("production_line", data.ProductionLine, 100)
            .RequiredString("start_date", data.StartDate).Date("start_date", data.StartDate)
            .Date("end_date", data.EndDate)
            .IntRange("progress_percentage", data.ProgressPercentage, 0, 100)
            .In("status", data.Status, "Waiting", "Running", "Paused", "Completed")
            .Check();

        var errors = new Dictionary<string, string[]>();
        if (!await _exists.OrderExists(data.OrderId!.Value))
            errors["order_id"] = new[] { "The selected order id is invalid." };
        if (data.StockId.HasValue && !await _exists.StockExists(data.StockId.Value))
            errors["stock_id"] = new[] { "The selected stock id is invalid." };

        // end_date >= start_date
        if (data.EndDate != null && data.StartDate != null
            && Validator.TryParseDate(data.EndDate, out var end) && Validator.TryParseDate(data.StartDate, out var start)
            && end < start)
            errors["end_date"] = new[] { "The end date must be a date after or equal to start date." };

        if (errors.Count > 0) throw new ValidationException(errors);
    }
}
