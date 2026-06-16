using AutoMapper;
using EcoWatchSystem.Data;
using EcoWatchSystem.Hubs;
using EcoWatchSystem.Interfaces;
using EcoWatchSystem.Models;
using EcoWatchSystem.Repositories;
using EcoWatchSystem.Services;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using Serilog.Events;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace EcoWatchSystem
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add HttpClient service
            builder.Services.AddHttpClient<AIReportPredictionService>();
            builder.Services.AddHttpContextAccessor();

            // Add services
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            #region JWT Setup
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new() { Title = "EcoWatch API", Version = "v1" });

                c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    In = Microsoft.OpenApi.Models.ParameterLocation.Header,
                    Description = "Enter 'Bearer' [space] and then your token"
                });

                c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
                {
                    {
                        new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                        {
                            Reference = new Microsoft.OpenApi.Models.OpenApiReference
                            {
                                Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    }
                });
            });
            #endregion

            #region Logging
            Log.Logger = new LoggerConfiguration()
                .ReadFrom.Configuration(builder.Configuration)
                  .CreateLogger();

            builder.Host.UseSerilog();


            #endregion

        

            //builder.Services.AddScoped<EmailService>();
            builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            builder.Services.AddFluentValidationAutoValidation();
            builder.Services.AddValidatorsFromAssemblyContaining<Program>();
            builder.Services.AddSignalR();
            builder.Services.AddSingleton<IUserIdProvider, NameUserIdProvider>();


            // Database
            builder.Services.AddDbContext<AppDbContext>(options =>
            {
                options.UseSqlServer(builder.Configuration.GetConnectionString("cs"));
            });

            // Repositories
            builder.Services.AddScoped<IAuthorityRepository, AuthorityRepository>();
            builder.Services.AddScoped<IRoutingRuleRepository, RoutingRuleRepository>();
            builder.Services.AddScoped<IEmailQueueRepository, EmailQueueRepository>();
            builder.Services.AddScoped<IRoutingHistoryRepository, RoutingHistoryRepository>();
            builder.Services.AddScoped<IReportRepository, ReportRepository>();
            builder.Services.AddScoped<IRecyclingRepository, RecyclingRepository>();
            builder.Services.AddScoped<IRecyclingCompanyRepo, RecyclingCompanyRepo>();
            builder.Services.AddScoped<IContractRepository, ContractRepository>();
            builder.Services.AddScoped<IRecyclingTransactionRepo, RecyclingTransactionRepo>();
            builder.Services.AddScoped<IAuthorityReportRepo,AuthorityReportRepo>();


            // services
            builder.Services.AddScoped<IReportService, ReportService>();
            builder.Services.AddScoped<IRuleService, RuleService>();
            builder.Services.AddScoped<IEmailQueueService, EmailQueueService>();
            builder.Services.AddScoped<IEmailTemplateService, EmailTemplateService>();
            builder.Services.AddScoped<EcoWatchSystem.Services.IEmailSender, EcoWatchSystem.Services.EmailSenderService>();
           builder.Services.AddScoped<IAuthoritiesReports, AuthoritiesReports>();

            builder.Services.AddScoped<IAuthorityService, AuthorityService>();
            builder.Services.AddScoped<ReportNotificationService>();
           

            builder.Services.AddScoped<IRecyclingService, RecyclingService>();
            builder.Services.AddScoped<IRecyclingCompanyService, RecyclingCompanyService>();
            builder.Services.AddScoped<IContractService, ContractService>();
            builder.Services.AddScoped<IRecyclingTransactionService, RecyclingTransactionService>();


            builder.Services.AddScoped<IPointsService, PointsService>();
            builder.Services.AddScoped<IRewardService, RewardService>();
            builder.Services.AddScoped<IRedemptionService, redemptionService>();
             builder.Services.AddHttpClient<IMLService, MLService>();
             builder.Services.AddScoped<IFilterService, FilterService>();
            builder.Services.AddScoped<ICommunityService, CommunityService>();  



            // convert enum
            builder.Services.AddControllers()
                .AddJsonOptions(options =>
               {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                  });

            // Token service
            builder.Services.AddScoped<IItokenService, jwtService>();

            // Identity
            builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
                   .AddEntityFrameworkStores<AppDbContext>()
                   .AddDefaultTokenProviders();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                    policy =>
                    {
                        policy.WithOrigins("http://localhost:3000")
                              .AllowAnyHeader()
                              .AllowAnyMethod()
                              .AllowCredentials(); 
                    });
            });


            #region Authentication Setup
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
           .AddJwtBearer(options =>
           {
               options.TokenValidationParameters = new TokenValidationParameters
               {
                   ValidateIssuer = true,
                   ValidateAudience = true,
                   ValidateLifetime = true,
                   ValidateIssuerSigningKey = true,
                   ValidIssuer = builder.Configuration["JWT:Issuer"],
                   ValidAudience = builder.Configuration["JWT:Audience"],
                   IssuerSigningKey = new SymmetricSecurityKey(
                       Encoding.UTF8.GetBytes(builder.Configuration["JWT:SecretKey"]!)
                   )
               };

               // أضيفي ده كله
               options.Events = new JwtBearerEvents
               {
                   OnMessageReceived = context =>
                   {
                       Console.WriteLine("JWT received: " + (context.Token ?? "No token"));
                       return Task.CompletedTask;
                   },
                   OnAuthenticationFailed = context =>
                   {
                       Console.WriteLine("JWT Auth FAILED: " + context.Exception.Message);
                       if (context.Exception.InnerException != null)
                           Console.WriteLine("Inner: " + context.Exception.InnerException.Message);
                       return Task.CompletedTask;
                   },
                   OnForbidden = context =>
                   {
                       Console.WriteLine("JWT Forbidden - Principal exists: " + (context.Principal != null));
                       if (context.Principal != null)
                       {
                           var claims = string.Join(" | ", context.Principal.Claims.Select(c => $"{c.Type}: {c.Value}"));
                           Console.WriteLine("Claims: " + claims);
                       }
                       return Task.CompletedTask;
                   },
                   OnTokenValidated = context =>
                   {
                       Console.WriteLine("JWT Token VALIDATED successfully");
                       return Task.CompletedTask;
                   }
               };
           });


            #endregion

            var app = builder.Build();


            // Middleware
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
                app.UseSerilogRequestLogging();

                using (var scope = app.Services.CreateScope())
                {
                    var services = scope.ServiceProvider;
                    try
                    {
                        var db = services.GetRequiredService<AppDbContext>();
                        await TestDataGenerator.SeedFakeDataAsync(db);
                    }
                    catch (Exception ex)
                    {
                        var logger = services.GetRequiredService<ILogger<Program>>();
                        logger.LogError(ex, "Error occurred during fake data generation.");
                    }
                }
            }

            app.UseCors("AllowAll");
           app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseStaticFiles();  
            app.UseAuthorization();

            app.MapControllers();
            app.MapHub<NotificationHub>("/Notification");
            app.Run();
        }
    }
}
