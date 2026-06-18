namespace TexTrack.Api.Models;

public class ProductionOrder
{
    public long Id { get; set; }
    public long OrderId { get; set; }
    public long? StockId { get; set; }
    public decimal? RequiredMeter { get; set; }
    public string ProductionLine { get; set; } = string.Empty;
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public int ProgressPercentage { get; set; }
    public string Status { get; set; } = "Waiting";
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Order? Order { get; set; }
    public Stock? Stock { get; set; }
    public ICollection<StockMovement> StockMovements { get; set; } = new List<StockMovement>();
    public ICollection<ProductionLog> ProductionLogs { get; set; } = new List<ProductionLog>();
    public ICollection<QualityControl> QualityControls { get; set; } = new List<QualityControl>();
}
