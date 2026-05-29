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

## Gereksinimler

- PHP 8.3 veya uzeri
- Composer
- Node.js 18 veya uzeri
- SQLite (varsayilan) veya MySQL

---

## Kurulum

### Backend

```bash
cd backend
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
composer install
php artisan migrate --seed
```

MySQL kullanilacaksa `.env` dosyasinda su satirlari duzenleyin:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=textrack
DB_USERNAME=root
DB_PASSWORD=
```

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
cd backend
php artisan serve
```

API `http://localhost:8000` adresinde calisir.

**Frontend:**

```bash
cd frontend
npm run dev
```

Uygulama `http://localhost:5173` adresinde acilir.

---

## Varsayilan Kullanicilar

Seed islemi asagidaki hesaplari olusturur:

| Rol | E-posta | Sifre |
|-----|---------|-------|
| Yonetici | admin@textrack.com | password |
| Operatör | operator@textrack.com | password |
