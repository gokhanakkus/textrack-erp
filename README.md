# TexTrack ERP

Tekstil üretim süreçlerini yönetmek için geliştirilmiş küçük ve orta ölçekli işletmelere yönelik bir ERP uygulamasıdır.

## Ne Yapar

**Müşteri Yönetimi**
Müşteri kayıtları, iletişim bilgileri ve sipariş geçmişi tek ekrandan takip edilir.

**Sipariş Yönetimi**
Sipariş oluşturma, durum takibi ve teslimat tarihi planlaması yapılır. Her siparişe birim satış fiyatı ve birim maliyet girilebilir.

**Stok Yönetimi**
Hammadde stok seviyeleri izlenir. Stok kritik seviyenin altına düştüğünde otomatik bildirim oluşturulur. Üretim emri oluşturulduğunda stok otomatik düşülür ve hareket kaydı tutulur.

**Üretim Takibi**
Üretim emirleri oluşturulur, üretim hattı ve durum bilgisi yönetilir. Her üretim emrine vardiya bazlı üretim kaydı (sabah / öğle / gece) girilebilir; tamamlanan adet toplamından ilerleme yüzdesi otomatik hesaplanır.

**Kalite Kontrol**
Üretim çıktıları için kalite kontrol kayıtları oluşturulur ve sonuçlar istatistiksel olarak raporlanır.

**Maliyet ve Kar Takibi**
Sipariş bazlı gelir, maliyet ve kar analizi yapılır. Aylık gelir/maliyet/kar grafiği ve sipariş kar tablosu sunulur.

**Bildirimler**
Kritik stok, geciken sipariş gibi sistem olayları bildirim olarak listelenir.

---

## Teknolojiler

- Backend: **.NET 10 (ASP.NET Core)** + Entity Framework Core
- Frontend: React + Vite
- Veritabani: SQLite

---

## Gereksinimler

- .NET 10 SDK
- Node.js 18 veya uzeri

---

## Kurulum

### Backend

```bash
cd backend-dotnet
dotnet restore
```

Ek bir yapilandirma gerekmez. Uygulama ilk calistiginda veritabanini (`textrack.db`)
otomatik olarak olusturur ve ornek veriyle doldurur.

### Frontend

```bash
cd frontend
npm install
```

---

## Calistirma

Backend ve frontend ayri terminallerde baslatilir.

**Backend:**

```bash
cd backend-dotnet
dotnet run
```

API `http://localhost:8000` adresinde calisir (migration + seed otomatik calisir).

**Frontend:**

```bash
cd frontend
npm run dev
```

Uygulama `http://localhost:5173` adresinde acilir.

---

## Varsayilan Kullanicilar

Seed islemi asagidaki hesaplari olusturur (tum sifreler `password`):

| Rol | E-posta | Sifre |
|-----|---------|-------|
| Yonetici | admin@textrack.com | password |
| Uretim Muduru | manager@textrack.com | password |
| Depo Personeli | warehouse@textrack.com | password |
| Kalite Kontrol | qc@textrack.com | password |
