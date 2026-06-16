using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using EcoWatchSystem.Models;
using Microsoft.EntityFrameworkCore;                 
using Microsoft.EntityFrameworkCore.Infrastructure;   
using Microsoft.EntityFrameworkCore.Storage;  

namespace EcoWatchSystem.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {



        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<PasswordReset> PasswordResets { get; set; }
        public DbSet<Reports> Reports => Set<Reports>();
        public DbSet<ReportAttachments> ReportAttachments => Set<ReportAttachments>();
        public DbSet<Authorities> Authorities { get; set; }
        public DbSet<EmailRoutingRules> EmailRoutingRules => Set<EmailRoutingRules>();
        public DbSet<EmailQueue> EmailQueue => Set<EmailQueue>();
        public DbSet<EmailAudit> EmailAudit => Set<EmailAudit>();
        public DbSet<RoutingHistory> RoutingHistory => Set<RoutingHistory>();

        public DbSet<RecyclingRequest> RecyclingRequests => Set<RecyclingRequest>();
        public DbSet<RecyclingCompany> RecyclingCompanies { get; set; }
        public DbSet<Contract> Contracts { get; set; }
        public DbSet<RecyclingItem> recyclingItems { get; set; }
        public DbSet<RecyclingTransaction> RecyclingTransactions { get; set; }
        public DbSet<UserPoint> UserPoints { get; set; }
        public DbSet<PointsTransaction> pointsTransactions { get; set; }
        public DbSet<Reward> Rewards { get; set; }
        public DbSet<RewardRedemption> RewardRedemptions { get; set; }

        public DbSet<Material> Materials { get; set; }
        public DbSet<AuthorityReport> AuthorityReports { get; set; }
        public DbSet<CommunityPost> CommunityPosts { get; set; }
        public DbSet<Volunteer> Volunteers { get; set; }


        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) {

  
             }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ApplicationUser>().ToTable("Users");
            builder.Entity<IdentityRole>().ToTable("Roles");

      
            builder.Entity<RecyclingTransaction>()
                .HasOne(t => t.Company)
                .WithMany()
                .HasForeignKey(t => t.CompanyId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<RecyclingTransaction>()
                .HasOne(t => t.User)
                .WithMany()
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<RecyclingTransaction>()
                .HasOne(t => t._contract)
                .WithMany()
                .HasForeignKey(t => t._contractId)
                .OnDelete(DeleteBehavior.Restrict);

           
            builder.Entity<RecyclingItem>()
                .Property(i => i.WeightKG)
                .HasPrecision(10, 2);

            builder.Entity<PointsTransaction>()
                .Property(p => p.QuantityKg)
                .HasPrecision(10, 2);

         
            builder.Entity<Authorities>().HasData(
                new Authorities
                {
                    Id = 1,
                    Name = "Ministry of Environment",
                    Email = "ministryofenvironment593@gmail.com",
                    Region = "*",
                    Category = "Water & Air Pollution"
                },
                new Authorities
                {
                    Id = 2,
                    Name = "Ministry of Electricity and Renewable Energy",
                    Email = "elecE@ecowatch.org",
                    Region = "*",
                    Category = "Electrical Problems"
                },
                new Authorities
                {
                    Id = 3,
                    Name = "Ministry of Local Development",
                    Email = "localdevE@ecowatch.org",
                    Region = "*",
                    Category = "Waste & Garbage"
                }
            );

          
            builder.Entity<EmailRoutingRules>().HasData(
                new EmailRoutingRules
                {
                    Id = 1,
                    Category = "Water Issues",
                    Region = "*",
                    Priority = 1,
                    AuthorityId = 1
                },
                new EmailRoutingRules
                {
                    Id = 2,
                    Category = "Electricity Issues",
                    Region = "*",
                    Priority = 1,
                    AuthorityId = 2
                },
                new EmailRoutingRules
                {
                    Id = 3,
                    Category = "Garbage & Waste",
                    Region = "*",
                    Priority = 1,
                    AuthorityId = 3
                },
                new EmailRoutingRules
                {
                    Id = 4,
                    Category = "Air Issues",
                    Region = "*",
                    Priority = 1,
                    AuthorityId = 1
                }
            );


           
            builder.Entity<IdentityRole>().HasData(
                new IdentityRole
                {
                    Id = "1",
                    Name = "Admin",
                    NormalizedName = "ADMIN",
                    ConcurrencyStamp = "b6a8fbb9-8e0b-4b55-9c92-6f2b6d2a8f11"
                },
                new IdentityRole
                {
                    Id = "2",
                    Name = "Authority",
                    NormalizedName = "AUTHORITY",
                    ConcurrencyStamp = "e2c85d47-f6b4-4e08-b94d-0bb2b713b9e7"
                },
                new IdentityRole
                {
                    Id = "3",
                    Name = "CitizenUser",
                    NormalizedName = "CITIZENUSER",
                    ConcurrencyStamp = "c09f5d4a-98b8-4a0e-9c3f-f8f3f58ad82a"
                },
                new IdentityRole
                {
                    Id = "4",
                    Name = "Recycler",
                    NormalizedName = "RECYCLER",
                    ConcurrencyStamp = "7d4d257d-6a90-49d3-bb79-9b2c1a2ebc7c"
                },
                 new IdentityRole
                 {
                     Id = "5",
                     Name = "Volunteer",
                     NormalizedName = "VOLUNTEER",
                     ConcurrencyStamp = "7d4d257d-6a90-49d3-bb79-9b2c1a2ebc7d"
                 }
            );

            // =========================
            // Seed materials
            // =========================
            builder.Entity<Material>().HasData(
                new Material
                {
                 Id=1,
                 Name="Plastic",
                 PointsPerKg=10

                },
                 new Material
                 {
                     Id = 2,
                     Name = "Paper",
                     PointsPerKg = 8

                 },
                  new Material
                  {
                      Id = 3,
                      Name = "Metals",
                      PointsPerKg = 15

                  },
                   new Material
                   {
                       Id = 4,
                       Name = "Organics",
                       PointsPerKg = 5

                   }



                );
        }
    }
}
