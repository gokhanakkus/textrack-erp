# TexTrack ERP — .NET Backend

Laravel (PHP) backend'inin **ASP.NET Core 10 (LTS)** karşılığı. Aynı REST API
sözleşmesini, JSON şeklini (snake_case + Laravel sayfalama meta'sı) ve iş
mantığını korur; mevcut React frontend hiçbir değişiklik yapmadan çalışır.

## Teknolojiler

| Katman | Teknoloji |
|--------|-----------|
| Framework | ASP.NET Core 10 (Controller API) |
| ORM | Entity Framework Core 10 (SQLite) |
| Auth | JWT Bearer (`Microsoft.AspNetCore.Authentication.JwtBearer`) |
| Şifre | BCrypt.Net-Next |

## Mimari (Laravel → .NET eşlemesi)

```
Controllers/   ← app/Http/Controllers      (REST uçları, route'lar)
Services/      ← app/Services               (iş mantığı)
Repositories/  ← app/Repositories           (veri erişimi)
Models/        ← app/Models                 (EF Core entity'leri)
Dtos/          ← app/Http/Resources + Requests (yanıt/istek şekilleri + mapper)
Data/          ← database/migrations + seeders (DbContext, migration, DbSeeder)
Infrastructure/← Middleware + Validator + Pagination (Laravel davranışı taklidi)
Auth/          ← JWT üretimi + auth()->id() karşılığı (CurrentUser)
```

## Çalıştırma

```bash
cd backend-dotnet
dotnet run        # http://localhost:8000 — migration + seed otomatik çalışır
```

İlk açılışta veritabanı (`textrack.db`) oluşturulur ve örnek veriyle doldurulur.
Frontend'in `vite.config.js` proxy'si zaten `http://localhost:8000`'e baktığından
Laravel yerine bu backend'i çalıştırmak yeterli.

## Giriş bilgileri (seed)

| E-posta | Şifre | Rol |
|---------|-------|-----|
| admin@textrack.com | password | admin |
| manager@textrack.com | password | production_manager |
| warehouse@textrack.com | password | warehouse_staff |
| qc@textrack.com | password | quality_control |

## Notlar

- Sıfırdan başlamak için `textrack.db` dosyasını silip tekrar `dotnet run` yapın.
- JWT secret ve TTL `appsettings.json > Jwt` altında; Laravel `.env` ile aynı secret kullanılır.
- Doğrulama hataları Laravel formatında döner: `422 { message, errors: { field: [...] } }`.
