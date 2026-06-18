namespace TexTrack.Api.Models;

public class Order
{
    public long Id { get; set; }
    public long UserId { get; set; }
    public long? CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string ProductType { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public string Size { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public DateOnly DeliveryDate { get; set; }
    public string Status { get; set; } = "Pending";
    public string? Notes { get; set; }
    public decimal? UnitPrice { get; set; }
    public decimal? UnitCost { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public User? User { get; set; }
    public Customer? Customer { get; set; }
    public ProductionOrder? ProductionOrder { get; set; }
}
