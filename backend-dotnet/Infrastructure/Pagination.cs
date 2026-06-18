using Microsoft.EntityFrameworkCore;
using TexTrack.Api.Dtos;

namespace TexTrack.Api.Infrastructure;

public class PagedResult<T>
{
    public List<T> Items { get; init; } = new();
    public PaginationMeta Meta { get; init; } = new();
}

public static class PaginationExtensions
{
    // Laravel ->paginate() karşılığı. Filtre sözlüğünden page / per_page okur.
    public static async Task<PagedResult<T>> PaginateAsync<T>(
        this IQueryable<T> query, IReadOnlyDictionary<string, string?> filters, int defaultPerPage = 15)
    {
        int perPage = GetInt(filters, "per_page") ?? defaultPerPage;
        int page = GetInt(filters, "page") ?? 1;
        if (page < 1) page = 1;
        if (perPage < 1) perPage = defaultPerPage;

        int total = await query.CountAsync();
        int lastPage = total == 0 ? 1 : (int)Math.Ceiling(total / (double)perPage);

        var items = await query.Skip((page - 1) * perPage).Take(perPage).ToListAsync();

        int? from = items.Count > 0 ? (page - 1) * perPage + 1 : null;
        int? to = items.Count > 0 ? (page - 1) * perPage + items.Count : null;

        return new PagedResult<T>
        {
            Items = items,
            Meta = new PaginationMeta
            {
                CurrentPage = page,
                LastPage = lastPage,
                PerPage = perPage,
                Total = total,
                From = from,
                To = to,
            }
        };
    }

    public static PaginatedResponse<TDto> Map<TEntity, TDto>(
        this PagedResult<TEntity> result, Func<TEntity, TDto> map) => new()
    {
        Data = result.Items.Select(map).ToList(),
        Meta = result.Meta,
    };

    private static int? GetInt(IReadOnlyDictionary<string, string?> filters, string key)
        => filters.TryGetValue(key, out var v) && int.TryParse(v, out var n) ? n : null;
}
