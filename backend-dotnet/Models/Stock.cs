namespace TexTrack.Api.Models;

public class Stock
{
    public long Id { get; set; }
    public long ProductId { get; set; }
    public string FabricType { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public decimal QuantityMeter { get; set; }
    public decimal CriticalLevel { get; set; } = 100;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Product? Product { get; set; }

    public bool IsCritical => QuantityMeter < CriticalLevel;
}
