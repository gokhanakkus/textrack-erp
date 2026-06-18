using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TexTrack.Api.Dtos;
using TexTrack.Api.Services;

namespace TexTrack.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/notifications")]
public class NotificationsController : ControllerBase
{
    private readonly NotificationService _service;
    public NotificationsController(NotificationService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> Index()
    {
        var notifications = await _service.GetAllAsync();
        var unreadCount = await _service.UnreadCountAsync();

        return Ok(new
        {
            data = notifications.Items.Select(n => n.ToDto()),
            unread_count = unreadCount,
            meta = new
            {
                current_page = notifications.Meta.CurrentPage,
                last_page = notifications.Meta.LastPage,
                total = notifications.Meta.Total,
            },
        });
    }

    [HttpPatch("{id:long}/read")]
    public async Task<IActionResult> MarkRead(long id)
    {
        var notification = await _service.MarkReadAsync(id);
        return Ok(notification.ToDto());
    }

    [HttpPatch("read-all")]
    public async Task<IActionResult> MarkAllRead()
    {
        var count = await _service.MarkAllReadAsync();
        return Ok(new { message = $"Marked {count} notifications as read" });
    }
}
