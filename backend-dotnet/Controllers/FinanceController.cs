using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TexTrack.Api.Infrastructure;
using TexTrack.Api.Services;

namespace TexTrack.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/finance")]
public class FinanceController : ControllerBase
{
    private readonly FinanceService _service;
    public FinanceController(FinanceService service) => _service = service;

    [HttpGet("stats")]
    public async Task<IActionResult> Stats() => Ok(await _service.GetStatsAsync());

    [HttpGet("orders")]
    public async Task<IActionResult> Orders() =>
        Ok(await _service.GetOrdersAsync(Request.Query.ToFilterDict()));
}
