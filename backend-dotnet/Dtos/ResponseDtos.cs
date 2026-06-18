namespace TexTrack.Api.Dtos;

// Laravel API Resource karşılıkları. Global snake_case JSON politikası ile
// property adları otomatik olarak customer_name, orders_count vb. olur.
// Null nested alanlar JSON'dan çıkarılır (WhenWritingNull) — Laravel'in whenLoaded davranışını taklit eder.

public record UserDto
{
    public long Id { get; init; }
    public string Name { get; init; } = "";
    public string Email { get; init; } = "";
    public string Role { get; init; } = "";
    public string? CreatedAt { get; init; }
}

public record CustomerDto
{
    public long Id { get; init; }
    public string Name { get; init; } = "";
    public string? ContactPerson { get; init; }
    public string? Email { get; init; }
    public string? Phone { get; init; }
    public string? City { get; init; }
    public string? Address { get; init; }
    public string? TaxNo { get; init; }
    public int OrdersCount { get; init; }
    public string? CreatedAt { get; init; }
}

public record ProductDto
{
    public long Id { get; init; }
    public string Name { get; init; } = "";
    public string Type { get; init; } = "";
    public string? Description { get; init; }
}

public record StockDto
{
    public long Id { get; init; }
    public long ProductId { get; init; }
    public string FabricType { get; init; } = "";
    public string Color { get; init; } = "";
    public double QuantityMeter { get; init; }
    public double CriticalLevel { get; init; }
    public bool IsCritical { get; init; }
    public ProductDto? Product { get; init; }
    public string? CreatedAt { get; init; }
    public string? UpdatedAt { get; init; }
}

// Üretim emri içinde gömülü kısa stok bilgisi
public record StockBriefDto
{
    public long Id { get; init; }
    public string FabricType { get; init; } = "";
    public string Color { get; init; } = "";
    public decimal QuantityMeter { get; init; }
}

public record OrderDto
{
    public long Id { get; init; }
    public string CustomerName { get; init; } = "";
    public string ProductType { get; init; } = "";
    public string Color { get; init; } = "";
    public string Size { get; init; } = "";
    public int Quantity { get; init; }
    public string? DeliveryDate { get; init; }
    public string Status { get; init; } = "";
    public string? Notes { get; init; }
    public UserDto? User { get; init; }
    public ProductionOrderDto? ProductionOrder { get; init; }
    public string? CreatedAt { get; init; }
    public string? UpdatedAt { get; init; }
}

public record ProductionOrderDto
{
    public long Id { get; init; }
    public long OrderId { get; init; }
    public long? StockId { get; init; }
    public decimal? RequiredMeter { get; init; }
    public string ProductionLine { get; init; } = "";
    public string? StartDate { get; init; }
    public string? EndDate { get; init; }
    public int ProgressPercentage { get; init; }
    public string Status { get; init; } = "";
    public string? Notes { get; init; }
    public OrderDto? Order { get; init; }
    public StockBriefDto? Stock { get; init; }
    public List<QualityControlDto>? QualityControls { get; init; }
    public string? CreatedAt { get; init; }
    public string? UpdatedAt { get; init; }
}

public record QualityControlDto
{
    public long Id { get; init; }
    public long ProductionOrderId { get; init; }
    public string DefectType { get; init; } = "";
    public string? Description { get; init; }
    public int DefectQuantity { get; init; }
    public int PassedQuantity { get; init; }
    public string Result { get; init; } = "";
    public ProductionOrderDto? ProductionOrder { get; init; }
    public string? CreatedAt { get; init; }
    public string? UpdatedAt { get; init; }
}

public record ProductionLogUserDto
{
    public long Id { get; init; }
    public string Name { get; init; } = "";
}

public record ProductionLogDto
{
    public long Id { get; init; }
    public long ProductionOrderId { get; init; }
    public string? Date { get; init; }
    public string Shift { get; init; } = "";
    public int ProducedQuantity { get; init; }
    public string? Notes { get; init; }
    public ProductionLogUserDto? User { get; init; }
    public string? CreatedAt { get; init; }
}

public record NotificationDto
{
    public long Id { get; init; }
    public string Title { get; init; } = "";
    public string Message { get; init; } = "";
    public string Type { get; init; } = "";
    public bool IsRead { get; init; }
    public string? CreatedAt { get; init; }
}

// Laravel sayfalama meta'sı (frontend current_page, last_page, total, per_page okur)
public record PaginationMeta
{
    public int CurrentPage { get; init; }
    public int LastPage { get; init; }
    public int PerPage { get; init; }
    public int Total { get; init; }
    public int? From { get; init; }
    public int? To { get; init; }
}

public record PaginatedResponse<T>
{
    public List<T> Data { get; init; } = new();
    public PaginationMeta Meta { get; init; } = new();
}
