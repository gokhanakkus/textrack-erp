using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TexTrack.Api.Services;

namespace TexTrack.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly DashboardService _service;
    public DashboardController(DashboardService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> Index()
    {
        return Ok(new
        {
            stats = await _service.GetStatsAsync(),
            weekly_production = await _service.GetWeeklyProductionAsync(),
            monthly_efficiency = await _service.GetMonthlyEfficiencyAsync(),
            defect_distribution = await _service.GetDefectDistributionAsync(),
        });
    }
}
