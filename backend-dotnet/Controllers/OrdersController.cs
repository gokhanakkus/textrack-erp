using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TexTrack.Api.Dtos;
using TexTrack.Api.Infrastructure;
using TexTrack.Api.Services;

namespace TexTrack.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/orders")]
public class OrdersController : ControllerBase
{
    private readonly OrderService _service;
    public OrdersController(OrderService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> Index()
    {
        var result = await _service.ListAsync(Request.Query.ToFilterDict());
        return Ok(result.Map(o => o.ToDto(withUser: true)));
    }

    [HttpPost]
    public async Task<IActionResult> Store([FromBody] StoreOrderRequest request)
    {
        var order = await _service.CreateAsync(request);
        return StatusCode(201, order.ToDto());
    }

    [HttpGet("{id:long}")]
    public async Task<IActionResult> Show(long id)
    {
        var order = await _service.FindAsync(id, withRelations: true)
            ?? throw new NotFoundException("Order not found");
        return Ok(order.ToDto(withUser: true, withProductionOrder: true));
    }

    [HttpPut("{id:long}")]
    [HttpPatch("{id:long}")]
    public async Task<IActionResult> Update(long id, [FromBody] UpdateOrderRequest request)
    {
        var order = await _service.FindAsync(id) ?? throw new NotFoundException("Order not found");
        var updated = await _service.UpdateAsync(order, request);
        return Ok(updated.ToDto());
    }

    [HttpDelete("{id:long}")]
    public async Task<IActionResult> Destroy(long id)
    {
        var order = await _service.FindAsync(id) ?? throw new NotFoundException("Order not found");
        await _service.DeleteAsync(order);
        return NoContent();
    }
}
