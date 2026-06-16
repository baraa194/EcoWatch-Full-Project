using EcoWatchSystem.Models;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace EcoWatchSystem.Configurations
{
    public class EmailRoutingRulesConfiguration : IEntityTypeConfiguration<EmailRoutingRules>
    {
        public void Configure(EntityTypeBuilder<EmailRoutingRules> builder)
        {
            builder.ToTable("EmailRoutingRules");
            builder.HasKey(r => r.Id);

            builder.Property(r => r.Category).IsRequired().HasMaxLength(100);
            builder.Property(r => r.Region).IsRequired().HasMaxLength(100);
            builder.Property(r => r.Priority).IsRequired();

            builder.HasIndex(r => new { r.Category, r.Region, r.Priority });
        }
    }
}
