using DevTalentOnboardingAnu.Models;
using Microsoft.EntityFrameworkCore;

namespace DevTalentOnboardingAnu.Models;

public class TalentDbContext : DbContext
{
    public DbSet<Customer> Customers { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<Store> Stores { get; set; }
    public DbSet<Sale> Sales { get; set; }

    public TalentDbContext(DbContextOptions<TalentDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Customer>()
            .HasMany(c => c.ProductSold)
            .WithOne(s => s.Customer)
            .HasForeignKey(s => s.CustomerId);

        modelBuilder.Entity<Product>()
            .HasMany(p => p.ProductSold)
            .WithOne(s => s.Product)
            .HasForeignKey(s => s.ProductId);

        modelBuilder.Entity<Store>()
            .HasMany(s => s.ProductSold)
            .WithOne(s => s.Store)
            .HasForeignKey(s => s.StoreId);
    }
}



