using Bogus; 
using System;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using EcoWatchSystem.Models;
using System.Collections.Generic;
using EcoWatchSystem.Enums;
using Microsoft.AspNetCore.Mvc;
namespace EcoWatchSystem.Data
{
    public class TestDataGenerator:ControllerBase
    {
        public static async Task SeedFakeDataAsync(AppDbContext db)
        {
            // Skip if data already exists (to avoid duplicates)
            if (await db.Reports.AnyAsync())
                return;

            // Sample categories and regions
            string[] categories = { "Recycling", "Garbage", "Pollution", "Safety" };
            string[] regions = { "North", "East", "South", "West" };

            // 🧩 Use Bogus.Faker<Reports> to create fake reports
            var faker = new Faker<Reports>()
                .RuleFor(r => r.Title, f => f.Lorem.Sentence(5))
                .RuleFor(r => r.Description, f => f.Lorem.Paragraph())
                .RuleFor(r => r.Category, f => f.PickRandom(categories))
                .RuleFor(r => r.Region, f => f.PickRandom(regions))
                .RuleFor(r => r.Status, f => ReportStatus.Pending)
                .RuleFor(r => r.CreatedAt, f => f.Date.Recent(15));

            // Generate 20 fake reports
            var fakeReports = faker.Generate(20);
            db.Reports.AddRange(fakeReports);
            await db.SaveChangesAsync();

            Console.WriteLine("Fake Reports added successfully!");

            // Optional: Add fake routing rules
            if (!await db.EmailRoutingRules.AnyAsync())
            {
                db.EmailRoutingRules.AddRange(
                    new EmailRoutingRules { Category = "Recycling", Region = "North", Priority = 1, AuthorityId = 1 },
                    new EmailRoutingRules { Category = "Garbage", Region = "East", Priority = 2, AuthorityId = 2 },
                    new EmailRoutingRules { Category = "Safety", Region = "South", Priority = 3, AuthorityId = 3 },
                    new EmailRoutingRules { Category = "Pollution", Region = "West", Priority = 1, AuthorityId = 2 },
                    new EmailRoutingRules { Category = "Recycling", Region = "East", Priority = 2, AuthorityId = 1 }
                );

                await db.SaveChangesAsync();
                Console.WriteLine("Fake Routing Rules added successfully!");
            }
        }
    }
}

