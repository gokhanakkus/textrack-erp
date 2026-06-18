using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace TexTrack.Api.Auth;

// Laravel'in auth()->id() / auth()->user() karşılığı.
public class CurrentUser
{
    private readonly IHttpContextAccessor _accessor;
    public CurrentUser(IHttpContextAccessor accessor) => _accessor = accessor;

    private ClaimsPrincipal? Principal => _accessor.HttpContext?.User;

    public long? Id
    {
        get
        {
            var sub = Principal?.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
                      ?? Principal?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return long.TryParse(sub, out var id) ? id : null;
        }
    }

    public string? Role => Principal?.FindFirst("role")?.Value;
}
