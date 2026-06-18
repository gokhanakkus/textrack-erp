using Microsoft.EntityFrameworkCore;
using TexTrack.Api.Data;
using TexTrack.Api.Infrastructure;
using TexTrack.Api.Models;

namespace TexTrack.Api.Repositories;

public class NotificationRepository
{
    private readonly AppDbContext _db;
    public NotificationRepository(AppDbContext db) => _db = db;

    public async Task<Notification> CreateAsync(Notification notification)
    {
        _db.Notifications.Add(notification);
        await _db.SaveChangesAsync();
        return notification;
    }

    public Task<PagedResult<Notification>> PaginateAsync(long userId, int perPage = 20)
    {
        var query = _db.Notifications
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.Id);
        var filters = new Dictionary<string, string?> { ["per_page"] = perPage.ToString() };
        return query.PaginateAsync(filters, perPage);
    }

    public async Task<Notification> MarkReadAsync(long id, long userId)
    {
        var notification = await _db.Notifications
            .FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId)
            ?? throw new NotFoundException("Notification not found");
        notification.IsRead = true;
        await _db.SaveChangesAsync();
        return notification;
    }

    public async Task<int> MarkAllReadAsync(long userId)
    {
        var unread = await _db.Notifications
            .Where(n => n.UserId == userId && !n.IsRead)
            .ToListAsync();
        foreach (var n in unread) n.IsRead = true;
        await _db.SaveChangesAsync();
        return unread.Count;
    }

    public Task<int> UnreadCountAsync(long userId) =>
        _db.Notifications.CountAsync(n => n.UserId == userId && !n.IsRead);
}
