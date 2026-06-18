using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TexTrack.Api.Dtos;
using TexTrack.Api.Infrastructure;
using TexTrack.Api.Services;

namespace TexTrack.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/production-orders")]
public class ProductionOrdersController : ControllerBase
{
    private readonly ProductionService _service;
    public ProductionOrdersController(ProductionService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> Index()
    {
        var result = await _service.ListAsync(Request.Query.ToFilterDict());
        return Ok(result.Map(p => p.ToDto(withOrder: true, withStock: true)));
    }

    [HttpPost]
    public async Task<IActionResult> Store([FromBody] StoreProductionOrderRequest request)
    {
        var production = await _service.CreateAsync(request);
        return StatusCode(201, production.ToDto(withOrder: true));
    }

    [HttpGet("{id:long}")]
    public async Task<IActionResult> Show(long id)
    {
        var production = await _service.GetAsync(id, withOrder: true, withQc: true)
            ?? throw new NotFoundException("Production order not found");
        return Ok(production.ToDto(withOrder: true, withQc: true));
    }

    [HttpPut("{id:long}")]
    [HttpPatch("{id:long}")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateProductionOrderRequest request)
    {
        var production = await _service.GetAsync(id) ?? throw new NotFoundException("Production order not found");
        var updated = await _service.UpdateAsync(production, request);
        return Ok(updated.ToDto(withOrder: true, withStock: true));
    }

    [HttpDelete("{id:long}")]
    public async Task<IActionResult> Destroy(long id)
    {
        var production = await _service.GetAsync(id) ?? throw new NotFoundException("Production order not found");
        await _service.DeleteAsync(production);
        return NoContent();
    }
}
