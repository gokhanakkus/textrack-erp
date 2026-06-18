namespace TexTrack.Api.Models;

public class Notification
{
    public long Id { get; set; }
    public long? UserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = "info"; // critical_stock | delayed_order | production_stopped | quality_issue | info
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public User? User { get; set; }
}
