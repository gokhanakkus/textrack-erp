namespace TexTrack.Api.Models;

public class StockMovement
{
    public long Id { get; set; }
    public long StockId { get; set; }
    public long? ProductionOrderId { get; set; }
    public long? UserId { get; set; }
    public string Type { get; set; } = string.Empty; // in | out
    public decimal QuantityMeter { get; set; }
    public string? Reason { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Stock? Stock { get; set; }
    public ProductionOrder? ProductionOrder { get; set; }
    public User? User { get; set; }
}
