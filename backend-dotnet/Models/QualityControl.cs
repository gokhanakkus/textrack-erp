namespace TexTrack.Api.Models;

public class QualityControl
{
    public long Id { get; set; }
    public long ProductionOrderId { get; set; }
    public string DefectType { get; set; } = "none"; // stitching_error | color_difference | torn_fabric | print_error | none
    public string? Description { get; set; }
    public int DefectQuantity { get; set; }
    public int PassedQuantity { get; set; }
    public string Result { get; set; } = "passed"; // passed | failed | partial
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public ProductionOrder? ProductionOrder { get; set; }
}
