using Microsoft.EntityFrameworkCore;
using TexTrack.Api.Models;

namespace TexTrack.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Stock> Stocks => Set<Stock>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<ProductionOrder> ProductionOrders => Set<ProductionOrder>();
    public DbSet<ProductionLog> ProductionLogs => Set<ProductionLog>();
    public DbSet<QualityControl> QualityControls => Set<QualityControl>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<StockMovement> StockMovements => Set<StockMovement>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        // Tablo adları Laravel ile aynı (snake_case çoğul)
        b.Entity<User>().ToTable("users");
        b.Entity<Customer>().ToTable("customers");
        b.Entity<Product>().ToTable("products");
        b.Entity<Stock>().ToTable("stocks");
        b.Entity<Order>().ToTable("orders");
        b.Entity<ProductionOrder>().ToTable("production_orders");
        b.Entity<ProductionLog>().ToTable("production_logs");
        b.Entity<QualityControl>().ToTable("quality_controls");
        b.Entity<Notification>().ToTable("notifications");
        b.Entity<StockMovement>().ToTable("stock_movements");

        b.Entity<User>(e =>
        {
            e.HasIndex(x => x.Email).IsUnique();
            e.Ignore(x => x.RememberToken);
        });

        b.Entity<Stock>(e =>
        {
            e.Property(x => x.QuantityMeter).HasColumnType("decimal(10,2)");
            e.Property(x => x.CriticalLevel).HasColumnType("decimal(10,2)");
            e.Ignore(x => x.IsCritical);
            e.HasOne(x => x.Product).WithMany(p => p.Stocks)
                .HasForeignKey(x => x.ProductId).OnDelete(DeleteBehavior.Cascade);
        });

        b.Entity<Order>(e =>
        {
            e.Property(x => x.UnitPrice).HasColumnType("decimal(10,2)");
            e.Property(x => x.UnitCost).HasColumnType("decimal(10,2)");
            e.HasOne(x => x.User).WithMany(u => u.Orders)
                .HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Customer).WithMany(c => c.Orders)
                .HasForeignKey(x => x.CustomerId).OnDelete(DeleteBehavior.SetNull);
            e.HasOne(x => x.ProductionOrder).WithOne(p => p.Order)
                .HasForeignKey<ProductionOrder>(p => p.OrderId).OnDelete(DeleteBehavior.Cascade);
        });

        b.Entity<ProductionOrder>(e =>
        {
            e.Property(x => x.RequiredMeter).HasColumnType("decimal(10,2)");
            e.HasOne(x => x.Stock).WithMany()
                .HasForeignKey(x => x.StockId).OnDelete(DeleteBehavior.SetNull);
        });

        b.Entity<ProductionLog>(e =>
        {
            e.HasOne(x => x.ProductionOrder).WithMany(p => p.ProductionLogs)
                .HasForeignKey(x => x.ProductionOrderId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.User).WithMany()
                .HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.SetNull);
            e.HasIndex(x => new { x.ProductionOrderId, x.Date, x.Shift }).IsUnique();
        });

        b.Entity<QualityControl>(e =>
        {
            e.HasOne(x => x.ProductionOrder).WithMany(p => p.QualityControls)
                .HasForeignKey(x => x.ProductionOrderId).OnDelete(DeleteBehavior.Cascade);
        });

        b.Entity<Notification>(e =>
        {
            e.HasOne(x => x.User).WithMany(u => u.Notifications)
                .HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
        });

        b.Entity<StockMovement>(e =>
        {
            e.Property(x => x.QuantityMeter).HasColumnType("decimal(10,2)");
            e.HasOne(x => x.Stock).WithMany()
                .HasForeignKey(x => x.StockId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.ProductionOrder).WithMany(p => p.StockMovements)
                .HasForeignKey(x => x.ProductionOrderId).OnDelete(DeleteBehavior.SetNull);
            e.HasOne(x => x.User).WithMany()
                .HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.SetNull);
        });
    }

    // Laravel'in created_at / updated_at otomatik doldurmasını taklit eder.
    public override int SaveChanges()
    {
        TouchTimestamps();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        TouchTimestamps();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void TouchTimestamps()
    {
        var now = DateTime.UtcNow;
        foreach (var entry in ChangeTracker.Entries())
        {
            if (entry.State == EntityState.Added)
            {
                SetIfExists(entry, "CreatedAt", now);
                SetIfExists(entry, "UpdatedAt", now);
            }
            else if (entry.State == EntityState.Modified)
            {
                SetIfExists(entry, "UpdatedAt", now);
            }
        }
    }

    private static void SetIfExists(Microsoft.EntityFrameworkCore.ChangeTracking.EntityEntry entry, string prop, DateTime value)
    {
        var p = entry.Metadata.FindProperty(prop);
        if (p != null && p.ClrType == typeof(DateTime))
            entry.Property(prop).CurrentValue = value;
    }
}
