namespace TexTrack.Api.Models;

public class ProductionLog
{
    public long Id { get; set; }
    public long ProductionOrderId { get; set; }
    public long? UserId { get; set; }
    public DateOnly Date { get; set; }
    public string Shift { get; set; } = string.Empty; // sabah | öğle | gece
    public int ProducedQuantity { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public ProductionOrder? ProductionOrder { get; set; }
    public User? User { get; set; }
}
