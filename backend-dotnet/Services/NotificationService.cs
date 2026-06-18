using TexTrack.Api.Auth;
using TexTrack.Api.Infrastructure;
using TexTrack.Api.Models;
using TexTrack.Api.Repositories;

namespace TexTrack.Api.Services;

public class NotificationService
{
    private readonly NotificationRepository _repo;
    private readonly CurrentUser _currentUser;

    public NotificationService(NotificationRepository repo, CurrentUser currentUser)
    {
        _repo = repo;
        _currentUser = currentUser;
    }

    public Task<Notification> CreateAsync(string title, string message, string type)
    {
        var notification = new Notification
        {
            UserId = _currentUser.Id,
            Title = title,
            Message = message,
            Type = type,
        };
        return _repo.CreateAsync(notification);
    }

    public Task<PagedResult<Notification>> GetAllAsync(int perPage = 20) =>
        _repo.PaginateAsync(_currentUser.Id ?? 0, perPage);

    public Task<Notification> MarkReadAsync(long id) =>
        _repo.MarkReadAsync(id, _currentUser.Id ?? 0);

    public Task<int> MarkAllReadAsync() =>
        _repo.MarkAllReadAsync(_currentUser.Id ?? 0);

    public Task<int> UnreadCountAsync() =>
        _repo.UnreadCountAsync(_currentUser.Id ?? 0);
}
