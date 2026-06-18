using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TexTrack.Api.Dtos;
using TexTrack.Api.Infrastructure;
using TexTrack.Api.Services;

namespace TexTrack.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/stocks")]
public class StocksController : ControllerBase
{
    private readonly StockService _service;
    public StocksController(StockService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> Index()
    {
        var result = await _service.ListAsync(Request.Query.ToFilterDict());
        return Ok(result.Map(s => s.ToDto()));
    }

    [HttpPost]
    public async Task<IActionResult> Store([FromBody] StoreStockRequest request)
    {
        var stock = await _service.CreateAsync(request);
        return StatusCode(201, stock.ToDto());
    }

    [HttpGet("{id:long}")]
    public async Task<IActionResult> Show(long id)
    {
        var stock = await _service.GetAsync(id, withProduct: true)
            ?? throw new NotFoundException("Stock not found");
        return Ok(stock.ToDto());
    }

    [HttpPut("{id:long}")]
    [HttpPatch("{id:long}")]
    public async Task<IActionResult> Update(long id, [FromBody] StoreStockRequest request)
    {
        var stock = await _service.GetAsync(id) ?? throw new NotFoundException("Stock not found");
        var updated = await _service.UpdateAsync(stock, request);
        return Ok(updated.ToDto());
    }

    [HttpDelete("{id:long}")]
    public async Task<IActionResult> Destroy(long id)
    {
        var stock = await _service.GetAsync(id) ?? throw new NotFoundException("Stock not found");
        await _service.DeleteAsync(stock);
        return NoContent();
    }
}
