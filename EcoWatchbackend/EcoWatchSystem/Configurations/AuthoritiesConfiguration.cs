using EcoWatchSystem.Models;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace EcoWatchSystem.Configurations
{
    public class AuthoritiesConfiguration : IEntityTypeConfiguration<Authorities>
    {
        public void Configure(EntityTypeBuilder<Authorities> builder)
        {
            builder.ToTable("Authorities");
            builder.HasKey(a => a.Id);

            builder.Property(a => a.Name).IsRequired().HasMaxLength(200);
            builder.Property(a => a.Email).IsRequired().HasMaxLength(250);
            builder.Property(a => a.Region).HasMaxLength(100);
            builder.Property(a => a.Category).HasMaxLength(100);

            builder.HasIndex(a => a.Email).IsUnique();
            builder.HasMany(a => a.RoutingRules)
                   .WithOne(r => r.Authority)
                   .HasForeignKey(r => r.AuthorityId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(a => a.RoutingHistories)
                   .WithOne(h => h.Authority)
                   .HasForeignKey(h => h.AuthorityId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
