using TexTrack.Api.Models;

namespace TexTrack.Api.Dtos;

public static class Mappers
{
    private static string Iso(DateTime dt) =>
        DateTime.SpecifyKind(dt, DateTimeKind.Utc).ToString("yyyy-MM-ddTHH:mm:ss.ffffffZ");

    private static string Ymd(DateOnly d) => d.ToString("yyyy-MM-dd");

    public static UserDto ToDto(this User u) => new()
    {
        Id = u.Id,
        Name = u.Name,
        Email = u.Email,
        Role = u.Role,
        CreatedAt = Iso(u.CreatedAt),
    };

    public static CustomerDto ToDto(this Customer c, int? ordersCount = null) => new()
    {
        Id = c.Id,
        Name = c.Name,
        ContactPerson = c.ContactPerson,
        Email = c.Email,
        Phone = c.Phone,
        City = c.City,
        Address = c.Address,
        TaxNo = c.TaxNo,
        OrdersCount = ordersCount ?? c.Orders?.Count ?? 0,
        CreatedAt = Iso(c.CreatedAt),
    };

    public static ProductDto ToDto(this Product p) => new()
    {
        Id = p.Id,
        Name = p.Name,
        Type = p.Type,
        Description = p.Description,
    };

    public static StockDto ToDto(this Stock s) => new()
    {
        Id = s.Id,
        ProductId = s.ProductId,
        FabricType = s.FabricType,
        Color = s.Color,
        QuantityMeter = (double)s.QuantityMeter,
        CriticalLevel = (double)s.CriticalLevel,
        IsCritical = s.IsCritical,
        Product = s.Product?.ToDto(),
        CreatedAt = Iso(s.CreatedAt),
        UpdatedAt = Iso(s.UpdatedAt),
    };

    public static OrderDto ToDto(this Order o, bool withUser = false, bool withProductionOrder = false) => new()
    {
        Id = o.Id,
        CustomerName = o.CustomerName,
        ProductType = o.ProductType,
        Color = o.Color,
        Size = o.Size,
        Quantity = o.Quantity,
        DeliveryDate = Ymd(o.DeliveryDate),
        Status = o.Status,
        Notes = o.Notes,
        User = (withUser && o.User != null) ? o.User.ToDto() : null,
        ProductionOrder = (withProductionOrder && o.ProductionOrder != null) ? o.ProductionOrder.ToDto() : null,
        CreatedAt = Iso(o.CreatedAt),
        UpdatedAt = Iso(o.UpdatedAt),
    };

    public static ProductionOrderDto ToDto(this ProductionOrder p,
        bool withOrder = false, bool withStock = false, bool withQc = false) => new()
    {
        Id = p.Id,
        OrderId = p.OrderId,
        StockId = p.StockId,
        RequiredMeter = p.RequiredMeter,
        ProductionLine = p.ProductionLine,
        StartDate = p.StartDate.HasValue ? Ymd(p.StartDate.Value) : null,
        EndDate = p.EndDate.HasValue ? Ymd(p.EndDate.Value) : null,
        ProgressPercentage = p.ProgressPercentage,
        Status = p.Status,
        Notes = p.Notes,
        Order = (withOrder && p.Order != null) ? p.Order.ToDto() : null,
        Stock = (withStock && p.Stock != null) ? new StockBriefDto
        {
            Id = p.Stock.Id,
            FabricType = p.Stock.FabricType,
            Color = p.Stock.Color,
            QuantityMeter = p.Stock.QuantityMeter,
        } : null,
        QualityControls = (withQc && p.QualityControls != null)
            ? p.QualityControls.Select(q => q.ToDto()).ToList() : null,
        CreatedAt = Iso(p.CreatedAt),
        UpdatedAt = Iso(p.UpdatedAt),
    };

    public static QualityControlDto ToDto(this QualityControl q, bool withProductionOrder = false) => new()
    {
        Id = q.Id,
        ProductionOrderId = q.ProductionOrderId,
        DefectType = q.DefectType,
        Description = q.Description,
        DefectQuantity = q.DefectQuantity,
        PassedQuantity = q.PassedQuantity,
        Result = q.Result,
        ProductionOrder = (withProductionOrder && q.ProductionOrder != null)
            ? q.ProductionOrder.ToDto(withOrder: q.ProductionOrder.Order != null) : null,
        CreatedAt = Iso(q.CreatedAt),
        UpdatedAt = Iso(q.UpdatedAt),
    };

    public static ProductionLogDto ToDto(this ProductionLog l, bool withUser = true) => new()
    {
        Id = l.Id,
        ProductionOrderId = l.ProductionOrderId,
        Date = Ymd(l.Date),
        Shift = l.Shift,
        ProducedQuantity = l.ProducedQuantity,
        Notes = l.Notes,
        User = (withUser && l.User != null)
            ? new ProductionLogUserDto { Id = l.User.Id, Name = l.User.Name } : null,
        CreatedAt = Iso(l.CreatedAt),
    };

    public static NotificationDto ToDto(this Notification n) => new()
    {
        Id = n.Id,
        Title = n.Title,
        Message = n.Message,
        Type = n.Type,
        IsRead = n.IsRead,
        CreatedAt = Iso(n.CreatedAt),
    };
}
