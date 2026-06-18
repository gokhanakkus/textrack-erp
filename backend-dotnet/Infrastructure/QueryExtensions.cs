namespace TexTrack.Api.Infrastructure;

public static class QueryExtensions
{
    // Request.Query -> filtre sözlüğü (Laravel $request->all() karşılığı)
    public static Dictionary<string, string?> ToFilterDict(this IQueryCollection query) =>
        query.ToDictionary(kv => kv.Key, kv => (string?)kv.Value.ToString());
}
