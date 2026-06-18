using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TexTrack.Api.Dtos;
using TexTrack.Api.Infrastructure;
using TexTrack.Api.Services;

namespace TexTrack.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/customers")]
public class CustomersController : ControllerBase
{
    private readonly CustomerService _service;
    public CustomersController(CustomerService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> Index()
    {
        var result = await _service.ListAsync(Request.Query.ToFilterDict());
        return Ok(result.Map(x => x.Customer.ToDto(x.OrdersCount)));
    }

    // Dropdown için tüm liste (sayfalama olmadan) — {id} route'undan önce gelmeli
    [HttpGet("all")]
    public async Task<IActionResult> All()
    {
        var customers = await _service.AllAsync();
        return Ok(customers.Select(c => c.ToDto()));
    }

    [HttpPost]
    public async Task<IActionResult> Store([FromBody] CustomerRequest request)
    {
        var customer = await _service.CreateAsync(request);
        return StatusCode(201, customer.ToDto(0));
    }

    [HttpGet("{id:long}")]
    public async Task<IActionResult> Show(long id)
    {
        var (customer, count) = await _service.FindAsync(id);
        return Ok(customer.ToDto(count));
    }

    [HttpPut("{id:long}")]
    [HttpPatch("{id:long}")]
    public async Task<IActionResult> Update(long id, [FromBody] CustomerRequest request)
    {
        var customer = await _service.GetAsync(id) ?? throw new NotFoundException("Customer not found");
        var updated = await _service.UpdateAsync(customer, request);
        return Ok(updated.ToDto());
    }

    [HttpDelete("{id:long}")]
    public async Task<IActionResult> Destroy(long id)
    {
        var customer = await _service.GetAsync(id) ?? throw new NotFoundException("Customer not found");
        await _service.DeleteAsync(customer);
        return NoContent();
    }
}
