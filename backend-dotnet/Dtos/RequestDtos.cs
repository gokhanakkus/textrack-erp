namespace TexTrack.Api.Dtos;

// Tüm alanlar nullable: "gönderilmedi" (null) ile "gönderildi" ayrımını korur.
// Bu, Laravel'in `sometimes` / partial update semantiğini taklit etmemizi sağlar.

public class LoginRequest
{
    public string? Email { get; set; }
    public string? Password { get; set; }
}

public class RegisterRequest
{
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? Password { get; set; }
    public string? PasswordConfirmation { get; set; }
    public string? Role { get; set; }
}

public class CustomerRequest
{
    public string? Name { get; set; }
    public string? ContactPerson { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? City { get; set; }
    public string? Address { get; set; }
    public string? TaxNo { get; set; }
}

public class StoreOrderRequest
{
    public string? CustomerName { get; set; }
    public string? ProductType { get; set; }
    public string? Color { get; set; }
    public string? Size { get; set; }
    public int? Quantity { get; set; }
    public string? DeliveryDate { get; set; }
    public string? Notes { get; set; }
}

public class UpdateOrderRequest
{
    public string? CustomerName { get; set; }
    public string? ProductType { get; set; }
    public string? Color { get; set; }
    public string? Size { get; set; }
    public int? Quantity { get; set; }
    public string? DeliveryDate { get; set; }
    public string? Status { get; set; }
    public string? Notes { get; set; }
}

public class StoreStockRequest
{
    public long? ProductId { get; set; }
    public string? FabricType { get; set; }
    public string? Color { get; set; }
    public decimal? QuantityMeter { get; set; }
    public decimal? CriticalLevel { get; set; }
}

public class StoreProductionOrderRequest
{
    public long? OrderId { get; set; }
    public long? StockId { get; set; }
    public decimal? RequiredMeter { get; set; }
    public string? ProductionLine { get; set; }
    public string? StartDate { get; set; }
    public string? EndDate { get; set; }
    public int? ProgressPercentage { get; set; }
    public string? Status { get; set; }
    public string? Notes { get; set; }
}

public class UpdateProductionOrderRequest
{
    public string? ProductionLine { get; set; }
    public string? StartDate { get; set; }
    public string? EndDate { get; set; }
    public int? ProgressPercentage { get; set; }
    public string? Status { get; set; }
    public string? Notes { get; set; }
}

public class StoreQualityControlRequest
{
    public long? ProductionOrderId { get; set; }
    public string? DefectType { get; set; }
    public string? Description { get; set; }
    public int? DefectQuantity { get; set; }
    public int? PassedQuantity { get; set; }
    public string? Result { get; set; }
}

public class UpdateQualityControlRequest
{
    public string? DefectType { get; set; }
    public string? Description { get; set; }
    public int? DefectQuantity { get; set; }
    public int? PassedQuantity { get; set; }
    public string? Result { get; set; }
}

public class StoreProductionLogRequest
{
    public string? Date { get; set; }
    public string? Shift { get; set; }
    public int? ProducedQuantity { get; set; }
    public string? Notes { get; set; }
}

public class UpdateProductionLogRequest
{
    public string? Date { get; set; }
    public string? Shift { get; set; }
    public int? ProducedQuantity { get; set; }
    public string? Notes { get; set; }
}
