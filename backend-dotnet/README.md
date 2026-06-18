# TexTrack ERP — .NET Backend

| Katman | Teknoloji |
|--------|-----------|
| Framework | ASP.NET Core 10 (Controller API) |
| ORM | Entity Framework Core 10 (SQLite) |
| Auth | JWT Bearer (`Microsoft.AspNetCore.Authentication.JwtBearer`) |
| Şifre | BCrypt.Net-Next |

## Mimari 

```
Controllers/   ← app/Http/Controllers      (REST uçları, route'lar)
Services/      ← app/Services               (iş mantığı)
Repositories/  ← app/Repositories           (veri erişimi)
Models/        ← app/Models                 (EF Core entity'leri)
Dtos/          ← app/Http/Resources + Requests (yanıt/istek şekilleri + mapper)
Data/          ← database/migrations + seeders (DbContext, migration, DbSeeder)
Infrastructure/← Middleware + Validator + Pagination
Auth/          ← JWT üretimi + auth()->id() karşılığı (CurrentUser)
```

## Çalıştırma

```bash
cd backend-dotnet
dotnet run        # http://localhost:8000 — migration + seed otomatik çalışır
```

İlk açılışta veritabanı (`textrack.db`) oluşturulur ve dummy data ile doldurulur.
Frontend'in `vite.config.js` proxy'si zaten `http://localhost:8000`'e baktığından
backend'i çalıştırmak yeterli.

## Giriş bilgileri (seed)

| E-posta | Şifre | Rol |
|---------|-------|-----|
| admin@textrack.com | password | admin |
| manager@textrack.com | password | production_manager |
| warehouse@textrack.com | password | warehouse_staff |
| qc@textrack.com | password | quality_control |

## Notlar

- Sıfırdan başlamak için `textrack.db` dosyasını silip tekrar `dotnet run` yapın.
- JWT secret ve TTL `appsettings.json > Jwt` altında; `.env` ile aynı secret kullanılır.
