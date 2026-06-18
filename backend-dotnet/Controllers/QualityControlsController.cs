using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TexTrack.Api.Dtos;
using TexTrack.Api.Infrastructure;
using TexTrack.Api.Services;

namespace TexTrack.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/quality-controls")]
public class QualityControlsController : ControllerBase
{
    private readonly QualityControlService _service;
    public QualityControlsController(QualityControlService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> Index()
    {
        var result = await _service.ListAsync(Request.Query.ToFilterDict());
        return Ok(result.Map(q => q.ToDto(withProductionOrder: true)));
    }

    // {id} route'undan önce gelmeli
    [HttpGet("stats")]
    public async Task<IActionResult> Stats() => Ok(await _service.GetDefectStatsAsync());

    [HttpPost]
    public async Task<IActionResult> Store([FromBody] StoreQualityControlRequest request)
    {
        var qc = await _service.CreateAsync(request);
        var loaded = await _service.GetAsync(qc.Id, withProductionOrder: true);
        return StatusCode(201, loaded!.ToDto(withProductionOrder: true));
    }

    [HttpGet("{id:long}")]
    public async Task<IActionResult> Show(long id)
    {
        var qc = await _service.GetAsync(id, withProductionOrder: true)
            ?? throw new NotFoundException("Quality control not found");
        return Ok(qc.ToDto(withProductionOrder: true));
    }

    [HttpPut("{id:long}")]
    [HttpPatch("{id:long}")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateQualityControlRequest request)
    {
        var qc = await _service.GetAsync(id) ?? throw new NotFoundException("Quality control not found");
        var updated = await _service.UpdateAsync(qc, request);
        return Ok(updated.ToDto());
    }

    [HttpDelete("{id:long}")]
    public async Task<IActionResult> Destroy(long id)
    {
        var qc = await _service.GetAsync(id) ?? throw new NotFoundException("Quality control not found");
        await _service.DeleteAsync(qc);
        return NoContent();
    }
}
