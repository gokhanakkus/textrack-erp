using System.Globalization;

namespace TexTrack.Api.Infrastructure;

// Laravel FormRequest doğrulama kurallarını taklit eden basit yardımcı.
// Hataları biriktirir; Check() çağrısı varsa ValidationException fırlatır.
public class Validator
{
    private readonly Dictionary<string, List<string>> _errors = new();

    private void Add(string field, string msg)
    {
        if (!_errors.TryGetValue(field, out var list))
        {
            list = new List<string>();
            _errors[field] = list;
        }
        list.Add(msg);
    }

    public Validator RequiredString(string field, string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            Add(field, $"The {field} field is required.");
        return this;
    }

    public Validator Required<T>(string field, T? value) where T : struct
    {
        if (value is null)
            Add(field, $"The {field} field is required.");
        return this;
    }

    public Validator Max(string field, string? value, int max)
    {
        if (value != null && value.Length > max)
            Add(field, $"The {field} may not be greater than {max} characters.");
        return this;
    }

    public Validator Email(string field, string? value)
    {
        if (!string.IsNullOrEmpty(value) && (!value.Contains('@') || !value.Contains('.')))
            Add(field, $"The {field} must be a valid email address.");
        return this;
    }

    public Validator IntMin(string field, int? value, int min)
    {
        if (value.HasValue && value.Value < min)
            Add(field, $"The {field} must be at least {min}.");
        return this;
    }

    public Validator IntRange(string field, int? value, int min, int max)
    {
        if (value.HasValue && (value.Value < min || value.Value > max))
            Add(field, $"The {field} must be between {min} and {max}.");
        return this;
    }

    public Validator DecimalMin(string field, decimal? value, decimal min)
    {
        if (value.HasValue && value.Value < min)
            Add(field, $"The {field} must be at least {min}.");
        return this;
    }

    public Validator In(string field, string? value, params string[] allowed)
    {
        if (value != null && !allowed.Contains(value))
            Add(field, $"The selected {field} is invalid.");
        return this;
    }

    public Validator Date(string field, string? value)
    {
        if (!string.IsNullOrEmpty(value) && !TryParseDate(value, out _))
            Add(field, $"The {field} is not a valid date.");
        return this;
    }

    public void Check()
    {
        if (_errors.Count > 0)
            throw new ValidationException(_errors.ToDictionary(k => k.Key, v => v.Value.ToArray()));
    }

    public static bool TryParseDate(string value, out DateOnly date)
    {
        if (DateTime.TryParse(value, CultureInfo.InvariantCulture, DateTimeStyles.None, out var dt))
        {
            date = DateOnly.FromDateTime(dt);
            return true;
        }
        date = default;
        return false;
    }

    public static DateOnly ParseDate(string value) =>
        TryParseDate(value, out var d) ? d : throw new ApiException($"Invalid date: {value}");
}
