using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TexTrack.Api.Dtos;
using TexTrack.Api.Infrastructure;
using TexTrack.Api.Services;

namespace TexTrack.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/production-orders/{productionOrderId:long}/logs")]
public class ProductionLogsController : ControllerBase
{
    private readonly ProductionLogService _service;
    private readonly ProductionService _productions;

    public ProductionLogsController(ProductionLogService service, ProductionService productions)
    {
        _service = service;
        _productions = productions;
    }

    [HttpGet]
    public async Task<IActionResult> Index(long productionOrderId)
    {
        var production = await _productions.GetAsync(productionOrderId)
            ?? throw new NotFoundException("Production order not found");
        var logs = await _service.GetForOrderAsync(production);
        return Ok(logs.Select(l => l.ToDto()));
    }

    [HttpPost]
    public async Task<IActionResult> Store(long productionOrderId, [FromBody] StoreProductionLogRequest request)
    {
        var production = await _productions.GetAsync(productionOrderId)
            ?? throw new NotFoundException("Production order not found");
        var log = await _service.CreateAsync(production, request);
        return StatusCode(201, log.ToDto());
    }

    [HttpPut("{logId:long}")]
    [HttpPatch("{logId:long}")]
    public async Task<IActionResult> Update(long productionOrderId, long logId, [FromBody] UpdateProductionLogRequest request)
    {
        var log = await _service.GetAsync(logId) ?? throw new NotFoundException("Log not found");
        var updated = await _service.UpdateAsync(log, request);
        return Ok(updated.ToDto());
    }

    [HttpDelete("{logId:long}")]
    public async Task<IActionResult> Destroy(long productionOrderId, long logId)
    {
        var log = await _service.GetAsync(logId) ?? throw new NotFoundException("Log not found");
        await _service.DeleteAsync(log);
        return NoContent();
    }
}
