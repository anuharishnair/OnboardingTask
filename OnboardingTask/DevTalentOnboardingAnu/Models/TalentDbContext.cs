using DevTalentOnboardingAnu.Models;
using Microsoft.EntityFrameworkCore;

public class TalentDbContext : DbContext
{
    public TalentDbContext(DbContextOptions<TalentDbContext> options) : base(options) { }

    public DbSet<Customer> Customers { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<Store> Stores { get; set; }
    public DbSet<Sales> Sales { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Sales>()
            .HasOne(s => s.Customer)
            .WithMany(c => c.ProductSold)
            .HasForeignKey(s => s.CustomerId);

        modelBuilder.Entity<Sales>()
            .HasOne(s => s.Product)
            .WithMany(p => p.ProductSold)
            .HasForeignKey(s => s.ProductId);

        modelBuilder.Entity<Sales>()
            .HasOne(s => s.Store)
            .WithMany(st => st.ProductSold)
            .HasForeignKey(s => s.StoreId);
    }
}
