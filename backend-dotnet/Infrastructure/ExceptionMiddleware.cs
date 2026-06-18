using System.Text.Json;

namespace TexTrack.Api.Infrastructure;

// Servis/controller katmanından fırlatılan istisnaları Laravel JSON formatına çevirir.
public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;
    private readonly JsonSerializerOptions _json;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger,
        IConfiguration config)
    {
        _next = next;
        _logger = logger;
        _json = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower };
    }

    public async Task InvokeAsync(HttpContext ctx)
    {
        try
        {
            await _next(ctx);
        }
        catch (ValidationException ex)
        {
            await Write(ctx, 422, new { message = ex.Message, errors = ex.Errors });
        }
        catch (NotFoundException ex)
        {
            await Write(ctx, 404, new { message = ex.Message });
        }
        catch (ApiException ex)
        {
            await Write(ctx, ex.StatusCode, new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception");
            await Write(ctx, 500, new { message = ex.Message });
        }
    }

    private async Task Write(HttpContext ctx, int status, object body)
    {
        ctx.Response.StatusCode = status;
        ctx.Response.ContentType = "application/json";
        await ctx.Response.WriteAsync(JsonSerializer.Serialize(body, _json));
    }
}
