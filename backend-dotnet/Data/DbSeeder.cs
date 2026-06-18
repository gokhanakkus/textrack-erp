using Microsoft.EntityFrameworkCore;
using TexTrack.Api.Models;

namespace TexTrack.Api.Data;

// Laravel seeder'larının .NET karşılığı. Veritabanı boşsa örnek veriyi yükler.
public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (await db.Users.AnyAsync()) return; // zaten seed edilmiş

        var rand = new Random(12345);
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        // ── Users ──
        var users = new[]
        {
            new User { Name = "Admin User",   Email = "admin@textrack.com",     Role = "admin" },
            new User { Name = "Ahmet Yılmaz", Email = "manager@textrack.com",   Role = "production_manager" },
            new User { Name = "Mehmet Demir", Email = "warehouse@textrack.com", Role = "warehouse_staff" },
            new User { Name = "Ayşe Kaya",    Email = "qc@textrack.com",        Role = "quality_control" },
        };
        foreach (var u in users) u.Password = BCrypt.Net.BCrypt.HashPassword("password");
        db.Users.AddRange(users);
        await db.SaveChangesAsync();

        var admin = users.First(u => u.Role == "admin");
        var manager = users.First(u => u.Role == "production_manager");

        // ── Products ──
        var products = new[]
        {
            new Product { Name = "Pamuk Düz Kumaş", Type = "Cotton",     Description = "100% cotton plain weave fabric" },
            new Product { Name = "Polyester Örgü",   Type = "Polyester",  Description = "High-quality polyester knit fabric" },
            new Product { Name = "Denim Kumaş",      Type = "Denim",      Description = "Classic denim fabric 12oz" },
            new Product { Name = "Viskon Kumaş",     Type = "Rayon",      Description = "Soft rayon viscose fabric" },
            new Product { Name = "Keten Kumaş",      Type = "Linen",      Description = "Natural linen fabric" },
            new Product { Name = "Yün Blend",        Type = "Wool Blend", Description = "Wool-polyester blend for outerwear" },
            new Product { Name = "Streç Kumaş",      Type = "Spandex",    Description = "Spandex elastane stretch fabric" },
            new Product { Name = "İpek Kumaş",       Type = "Silk",       Description = "Luxury silk fabric" },
            new Product { Name = "Polar Kumaş",      Type = "Fleece",     Description = "Soft polar fleece fabric" },
            new Product { Name = "Kadife Kumaş",     Type = "Velvet",     Description = "Premium velvet fabric" },
        };
        db.Products.AddRange(products);
        await db.SaveChangesAsync();

        // ── Stocks ──
        var stocks = new (int prod, string fabric, string color, decimal qty, decimal crit)[]
        {
            (1, "Cotton", "Ham Beyaz", 2500m, 500m), (1, "Cotton", "Lacivert", 80m, 500m),
            (2, "Polyester", "Siyah", 1800m, 300m),  (2, "Polyester", "Gri", 45m, 200m),
            (3, "Denim", "Lacivert", 3200m, 600m),   (3, "Denim", "Siyah", 120m, 400m),
            (4, "Rayon", "Bej", 950m, 200m),         (5, "Linen", "Haki", 750m, 150m),
            (6, "Wool Blend", "Bordo", 60m, 100m),   (7, "Spandex", "Siyah", 500m, 100m),
            (8, "Silk", "Kırmızı", 200m, 50m),       (9, "Fleece", "Gri", 1100m, 250m),
            (10, "Velvet", "Yeşil", 30m, 80m),
        };
        db.Stocks.AddRange(stocks.Select(s => new Stock
        {
            ProductId = products[s.prod - 1].Id,
            FabricType = s.fabric, Color = s.color, QuantityMeter = s.qty, CriticalLevel = s.crit,
        }));
        await db.SaveChangesAsync();

        // ── Orders ──
        var orders = new (string customer, string product, string color, string size, int qty, int dayOffset, string status, long userId)[]
        {
            ("LC Waikiki A.Ş.", "T-Shirt", "Lacivert", "M", 5000, -30, "Completed", admin.Id),
            ("Koton Tekstil", "Polo Shirt", "Beyaz", "L", 3000, -20, "Completed", admin.Id),
            ("Mavi Giyim", "Jeans", "Lacivert", "32", 2000, -15, "Completed", manager.Id),
            ("Defacto Perakende", "Dress", "Bordo", "S", 1500, -10, "Completed", manager.Id),
            ("H&M Türkiye", "Blouse", "Beyaz", "XS", 4000, -5, "Completed", admin.Id),
            ("Zara Türkiye", "Jacket", "Siyah", "L", 2500, 15, "In Production", admin.Id),
            ("Bershka Perakende", "Trousers", "Haki", "M", 1800, 20, "In Production", manager.Id),
            ("Pull&Bear Mağazaları", "Shorts", "Bej", "XL", 3500, 25, "In Production", admin.Id),
            ("Stradivarius Türkiye", "Skirt", "Kırmızı", "S", 1200, 18, "In Production", manager.Id),
            ("Massimo Dutti TR", "Suit", "Gri", "50", 800, 30, "In Production", admin.Id),
            ("Boyner Mağazaları", "Cardigan", "Bej", "M", 2200, 7, "Quality Control", manager.Id),
            ("Network Moda", "Vest", "Lacivert", "L", 1600, 10, "Quality Control", admin.Id),
            ("Marks & Spencer TR", "Coat", "Siyah", "XXL", 900, 45, "Pending", admin.Id),
            ("Tommy Hilfiger TR", "Polo Shirt", "Lacivert", "M", 3000, 35, "Pending", manager.Id),
            ("Calvin Klein TR", "T-Shirt", "Beyaz", "S", 4500, 40, "Pending", admin.Id),
            ("Levi's Türkiye", "Jeans", "Lacivert", "34", 2800, 50, "Pending", manager.Id),
            ("Nike Türkiye", "Shorts", "Siyah", "L", 5000, 28, "Pending", admin.Id),
            ("Adidas TR", "Tracksuit", "Kırmızı", "M", 2000, 32, "Pending", manager.Id),
            ("Ipekyol Moda", "Evening Dress", "Bordo", "S", 600, -3, "Delayed", admin.Id),
            ("Vakko Tekstil", "Suit", "Lacivert", "48", 400, -7, "Delayed", manager.Id),
            ("Twist Moda", "Blouse", "Pembe", "XS", 1800, -2, "Delayed", admin.Id),
            ("Çiçek Tekstil", "T-Shirt", "Sarı", "M", 2500, -5, "Delayed", manager.Id),
            ("Atlas Tekstil", "Trousers", "Siyah", "L", 1100, -1, "Delayed", admin.Id),
            ("Puma TR", "Jacket", "Yeşil", "M", 1500, 22, "Pending", manager.Id),
            ("Under Armour TR", "T-Shirt", "Gri", "XL", 3000, 26, "Pending", admin.Id),
        };
        db.Orders.AddRange(orders.Select(o => new Order
        {
            UserId = o.userId, CustomerName = o.customer, ProductType = o.product,
            Color = o.color, Size = o.size, Quantity = o.qty,
            DeliveryDate = today.AddDays(o.dayOffset), Status = o.status,
        }));
        await db.SaveChangesAsync();

        // ── Customers + mevcut siparişlere bağla ──
        var customers = new (string name, string contact, string email, string phone, string city, string tax)[]
        {
            ("LC Waikiki A.Ş.", "Ahmet Yıldız", "tedarik@lcwaikiki.com", "0212 555 01 01", "İstanbul", "1234567890"),
            ("Koton Tekstil", "Selin Kaya", "uretim@koton.com", "0212 555 02 02", "İstanbul", "2345678901"),
            ("Mavi Giyim", "Burak Demir", "siparis@mavi.com", "0216 555 03 03", "İstanbul", "3456789012"),
            ("Defacto Perakende", "Ayşe Çelik", "tedarik@defacto.com", "0212 555 04 04", "İzmir", "4567890123"),
            ("H&M Türkiye", "Mert Aksoy", "supply@hm.com.tr", "0212 555 05 05", "İstanbul", "5678901234"),
            ("Zara Türkiye", "Ceren Yılmaz", "uretim@zara.com.tr", "0212 555 06 06", "İstanbul", "6789012345"),
            ("Bershka Perakende", "Enes Şahin", "siparis@bershka.com.tr", "0216 555 07 07", "Ankara", "7890123456"),
            ("Pull&Bear Mağazaları", "Derya Kılıç", "tedarik@pullbear.com", "0212 555 08 08", "İstanbul", "8901234567"),
            ("Stradivarius Türkiye", "Gizem Arslan", "uretim@stradivarius.com", "0212 555 09 09", "İstanbul", "9012345678"),
            ("Massimo Dutti TR", "Kemal Öztürk", "siparis@massimodutti.com", "0212 555 10 10", "İstanbul", "0123456789"),
            ("Boyner Mağazaları", "Pınar Aydın", "tedarik@boyner.com.tr", "0216 555 11 11", "İstanbul", "1122334455"),
            ("Network Moda", "Tolga Başaran", "uretim@network.com.tr", "0312 555 12 12", "Ankara", "2233445566"),
            ("Marks & Spencer TR", "Berna Koç", "supply@marksandspencer.tr", "0212 555 13 13", "İstanbul", "3344556677"),
            ("Tommy Hilfiger TR", "Selim Güven", "tedarik@tommy.com.tr", "0212 555 14 14", "İstanbul", "4455667788"),
            ("Calvin Klein TR", "İrem Toprak", "siparis@calvinklein.tr", "0212 555 15 15", "İstanbul", "5566778899"),
            ("Levi's Türkiye", "Alp Ergün", "uretim@levis.com.tr", "0216 555 16 16", "İzmir", "6677889900"),
            ("Nike Türkiye", "Zeynep Polat", "supply@nike.com.tr", "0212 555 17 17", "İstanbul", "7788990011"),
            ("Adidas TR", "Okan Şimşek", "tedarik@adidas.com.tr", "0212 555 18 18", "İstanbul", "8899001122"),
            ("Ipekyol Moda", "Hande Doğan", "siparis@ipekyol.com.tr", "0212 555 19 19", "İstanbul", "9900112233"),
            ("Vakko Tekstil", "Serkan Uysal", "uretim@vakko.com.tr", "0212 555 20 20", "İstanbul", "1011121314"),
            ("Twist Moda", "Elif Karahan", "tedarik@twist.com.tr", "0216 555 21 21", "Bursa", "1112131415"),
            ("Çiçek Tekstil", "Murat Tuncer", "siparis@cicektekstil.com", "0224 555 22 22", "Bursa", "1213141516"),
            ("Atlas Tekstil", "Nilüfer Acar", "uretim@atlastekstil.com", "0322 555 23 23", "Adana", "1314151617"),
            ("Puma TR", "Barış Yaman", "supply@puma.com.tr", "0212 555 24 24", "İstanbul", "1415161718"),
            ("Under Armour TR", "Gökhan Çetin", "tedarik@underarmour.tr", "0212 555 25 25", "İstanbul", "1516171819"),
        };
        foreach (var c in customers)
        {
            var customer = new Customer
            {
                Name = c.name, ContactPerson = c.contact, Email = c.email,
                Phone = c.phone, City = c.city, TaxNo = c.tax,
            };
            db.Customers.Add(customer);
            await db.SaveChangesAsync();

            await db.Orders.Where(o => o.CustomerName == c.name)
                .ExecuteUpdateAsync(s => s.SetProperty(o => o.CustomerId, customer.Id));
        }

        // ── Production Orders ──
        var lines = new[] { "Hat-A", "Hat-B", "Hat-C", "Hat-D" };
        var allOrders = await db.Orders.OrderBy(o => o.Id).ToListAsync();

        var completed = allOrders.Where(o => o.Status == "Completed").ToList();
        for (int i = 0; i < completed.Count; i++)
            db.ProductionOrders.Add(new ProductionOrder
            {
                OrderId = completed[i].Id, ProductionLine = lines[i % 4],
                StartDate = today.AddDays(-rand.Next(40, 61)),
                EndDate = completed[i].DeliveryDate, ProgressPercentage = 100, Status = "Completed",
            });

        var inProd = allOrders.Where(o => o.Status == "In Production").ToList();
        var progresses = new[] { 65, 40, 80, 25, 55 };
        for (int i = 0; i < inProd.Count; i++)
            db.ProductionOrders.Add(new ProductionOrder
            {
                OrderId = inProd[i].Id, ProductionLine = lines[i % 4],
                StartDate = today.AddDays(-rand.Next(5, 16)),
                EndDate = null, ProgressPercentage = progresses[i % progresses.Length], Status = "Running",
            });

        var qc = allOrders.Where(o => o.Status == "Quality Control").ToList();
        for (int i = 0; i < qc.Count; i++)
            db.ProductionOrders.Add(new ProductionOrder
            {
                OrderId = qc[i].Id, ProductionLine = lines[i % 4],
                StartDate = today.AddDays(-rand.Next(20, 31)),
                EndDate = today.AddDays(-rand.Next(2, 6)), ProgressPercentage = 100, Status = "Completed",
            });

        var delayed = allOrders.Where(o => o.Status == "Delayed").ToList();
        var pauseProgress = new[] { 30, 45, 10, 70, 50 };
        for (int i = 0; i < delayed.Count; i++)
            db.ProductionOrders.Add(new ProductionOrder
            {
                OrderId = delayed[i].Id, ProductionLine = lines[i % 4],
                StartDate = today.AddDays(-rand.Next(15, 26)),
                EndDate = null, ProgressPercentage = pauseProgress[i % pauseProgress.Length], Status = "Paused",
            });
        await db.SaveChangesAsync();

        // ── Quality Controls (tamamlanan üretimler için) ──
        var completedProductions = await db.ProductionOrders
            .Where(p => p.Status == "Completed").OrderBy(p => p.Id).ToListAsync();
        var defects = new (string type, string result, int defect, int passed)[]
        {
            ("stitching_error", "partial", 12, 488), ("color_difference", "failed", 85, 215),
            ("none", "passed", 0, 1000), ("torn_fabric", "partial", 25, 975),
            ("print_error", "failed", 120, 380), ("none", "passed", 0, 800),
            ("stitching_error", "partial", 35, 965), ("color_difference", "partial", 18, 482),
        };
        for (int i = 0; i < completedProductions.Count; i++)
        {
            var d = defects[i % defects.Length];
            db.QualityControls.Add(new QualityControl
            {
                ProductionOrderId = completedProductions[i].Id,
                DefectType = d.type,
                Description = d.type == "none"
                    ? "All units passed quality inspection."
                    : $"Found {d.defect} units with {d.type} issue.",
                DefectQuantity = d.defect, PassedQuantity = d.passed, Result = d.result,
            });
        }
        await db.SaveChangesAsync();

        // ── Notifications ──
        var notifications = new (string title, string message, string type, bool read)[]
        {
            ("Kritik Stok Uyarısı", "Pamuk Lacivert stoku kritik seviyenin altında (80m / 500m eşiği).", "critical_stock", false),
            ("Kritik Stok Uyarısı", "Polyester Gri stoku kritik seviyenin altında (45m / 200m eşiği).", "critical_stock", false),
            ("Sipariş Gecikti", "İpekyol Moda (Abiye Elbise) siparişinin teslim tarihi geçti.", "delayed_order", false),
            ("Sipariş Gecikti", "Vakko Tekstil (Takım Elbise) siparişi 7 gün gecikti.", "delayed_order", false),
            ("Üretim Duraklatıldı", "Hat-B üretim hattı Twist Moda siparişi için duraklatıldı.", "production_stopped", true),
            ("Kalite Sorunu Tespit Edildi", "Koton Tekstil Polo ürününden 85 adet renk farkı kontrolünden geçemedi.", "quality_issue", true),
            ("Kritik Stok Uyarısı", "Denim Siyah stoku kritik seviyenin altında (120m / 400m).", "critical_stock", false),
            ("Sipariş Gecikti", "Çiçek Tekstil T-Shirt siparişi malzeme eksikliği nedeniyle gecikti.", "delayed_order", true),
            ("Üretim Tamamlandı", "LC Waikiki T-Shirt üretimi tamamlandı. Kalite kontrole aktarıldı.", "info", true),
            ("Yeni Sipariş Alındı", "Under Armour TR'den 3000 adet T-Shirt için yeni sipariş alındı.", "info", true),
        };
        db.Notifications.AddRange(notifications.Select(n => new Notification
        {
            UserId = admin.Id, Title = n.title, Message = n.message, Type = n.type, IsRead = n.read,
        }));
        await db.SaveChangesAsync();

        // ── Finance: siparişlere birim fiyat/maliyet ata ──
        var priceMap = new Dictionary<string, (int min, int max, double m0, double m1)>
        {
            ["Gömlek"] = (120, 220, 0.38, 0.52), ["Pantolon"] = (180, 350, 0.40, 0.55),
            ["Tişört"] = (80, 150, 0.35, 0.50), ["Etek"] = (140, 260, 0.38, 0.52),
            ["Ceket"] = (400, 900, 0.42, 0.58), ["Mont"] = (600, 1400, 0.44, 0.60),
            ["Kumaş"] = (60, 120, 0.30, 0.48),
        };
        var def = (min: 100, max: 300, m0: 0.38, m1: 0.52);
        foreach (var o in allOrders)
        {
            var cfg = priceMap.TryGetValue(o.ProductType, out var p) ? p : def;
            decimal unitPrice = rand.Next(cfg.min * 100, cfg.max * 100) / 100m;
            double costRatio = cfg.m0 + rand.NextDouble() * (cfg.m1 - cfg.m0);
            o.UnitPrice = unitPrice;
            o.UnitCost = Math.Round(unitPrice * (decimal)costRatio, 2);
        }
        await db.SaveChangesAsync();
    }
}
