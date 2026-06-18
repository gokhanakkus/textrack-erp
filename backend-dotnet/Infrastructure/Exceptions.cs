namespace TexTrack.Api.Infrastructure;

// Laravel ValidationException karşılığı → HTTP 422 { message, errors }
public class ValidationException : Exception
{
    public Dictionary<string, string[]> Errors { get; }

    public ValidationException(Dictionary<string, string[]> errors)
        : base("The given data was invalid.")
    {
        Errors = errors;
    }
}

// İş kuralı hatası (örn. yetersiz stok) → HTTP 400 { message }
public class ApiException : Exception
{
    public int StatusCode { get; }
    public ApiException(string message, int statusCode = 400) : base(message)
    {
        StatusCode = statusCode;
    }
}

// Kayıt bulunamadı → HTTP 404 (Laravel ModelNotFoundException / findOrFail)
public class NotFoundException : Exception
{
    public NotFoundException(string message = "Not found") : base(message) { }
}
