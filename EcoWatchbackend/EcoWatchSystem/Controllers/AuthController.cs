using EcoWatchSystem.Data;
using EcoWatchSystem.DTO;
using EcoWatchSystem.Interfaces;
using EcoWatchSystem.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mail;
using System.Net;

namespace EcoWatchSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
       


        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IItokenService _jwtService;
        private readonly RoleManager<IdentityRole> _roleManager;
        private ILogger <AuthController> _logger;

        public AuthController(
            AppDbContext context, UserManager<ApplicationUser> userManager,
            IItokenService jwtService, RoleManager<IdentityRole> roleManager,
            ILogger<AuthController> logger) 
        {
            _context = context;
            _userManager = userManager;
            _jwtService = jwtService;
            _roleManager = roleManager;
            _logger = logger;
        }


        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshRequest request)
        {
            var refreshToken = _context.RefreshTokens
                 .FirstOrDefault(rt => rt.Token == request.RefreshToken && !rt.IsRevoked);

            if (refreshToken == null || refreshToken.ExpiresAt < DateTime.UtcNow)
            {
                return Unauthorized("Invalid or expired refresh token");
            }

            var user = await _userManager.FindByIdAsync(refreshToken.UserId);
            var newAccessToken = await _jwtService.GenerateAccessToken(user);
            var newRefreshToken = _jwtService.GenerateRefreshToken();


            refreshToken.IsRevoked = true;


            _context.RefreshTokens.Add(new RefreshToken
            {
                Token = newRefreshToken,
                UserId = user.Id,
                ExpiresAt = DateTime.UtcNow.AddDays(30)
            });

            await _context.SaveChangesAsync();

            return Ok(new
            {
                accessToken = newAccessToken,
                refreshToken = newRefreshToken
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO dto)
        {
            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser != null) return BadRequest("User already exists");

            var user = new ApplicationUser
            {
                UserName = dto.UserName,
                Email = dto.Email,
                location = dto.Location,
                age = dto.Age,
                joinDate = DateTime.Now,
                PhoneNumber = dto.Phone,
                IsDeleted = false 
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded) return BadRequest(result.Errors);

            var role = string.IsNullOrEmpty(dto.Role) ? "citizenUser" : dto.Role;

           
            var roleExists = await _roleManager.RoleExistsAsync(role);
            if (!roleExists) return BadRequest($"Role '{role}' does not exist");

            await _userManager.AddToRoleAsync(user, role);

            // If registering as Volunteer, create Volunteer record automatically
            if (role.Equals("Volunteer", StringComparison.OrdinalIgnoreCase))
            {
                var volunteer = new EcoWatchSystem.Models.Volunteer
                {
                    UserId = user.Id,
                    JoinDate = DateTime.UtcNow,
                    Status = "Approved",
                    IsActive = true,
                    TotalTasksCompleted = 0,
                    TotalHours = 0,
                    ImpactScore = 0
                };
                _context.Volunteers.Add(volunteer);
                await _context.SaveChangesAsync();
            }

            return Ok(new { Message = "User registered successfully", Role = role });
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO dto)
        {
            var user = await _userManager.FindByNameAsync(dto.username);
            if (user == null)
            {
                _logger.LogError("User with name {username} is not found at {time}", 
                    dto.username, DateTime.Now);
                return Unauthorized("Invalid credentials");
            }

            var validPassword = await _userManager.CheckPasswordAsync(user, dto.Password);
            if (!validPassword) return Unauthorized("Invalid credentials");

            var token = await _jwtService.GenerateAccessToken(user);
            var refreshToken = _jwtService.GenerateRefreshToken();

            // Save refresh token to DB
            _context.RefreshTokens.Add(new RefreshToken
            {
                Token = refreshToken,
                UserId = user.Id,
                ExpiresAt = DateTime.UtcNow.AddDays(30)
            });
            await _context.SaveChangesAsync();

            return Ok(new { Token = token, RefreshToken = refreshToken });
        }



        [HttpPost("ForgetPassword")]
        public async Task<IActionResult> ResetPass(string email)
        {
            var userFromDb = await _userManager.FindByEmailAsync(email);
            if (userFromDb != null)
            {
                var oldPwd = _context.PasswordResets.FirstOrDefault(e => e.Email == email);
                if (oldPwd != null)
                {
                    
                    _context.Remove(oldPwd);
                }

                string token = Guid.NewGuid().ToString();

                PasswordReset pwdReset = new PasswordReset()
                {
                    Email = email,
                    Token = token,
                    CreatedDate = DateTime.Now,
                };
                _context.PasswordResets.Add(pwdReset);
                _context.SaveChanges();

                string subject = "Password Reset";
                string username = userFromDb.UserName;
                string body = $"Dear {username},\n\n" +
                              $"We received your password reset request.\n" +
                              $"Please use the following token to reset your password:\n\n{token}\n\n" +
                              $"Best wishes.";

            
                var smtpClient = new SmtpClient("smtp.gmail.com", 587)
                {
                    Credentials = new NetworkCredential("ecowatchsystem@gmail.com", "zdcp qjfk dljo rcjk"),
                    EnableSsl = true
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress("ecowatchsystem@gmail.com", "EcoWatch System"),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = false
                };
                mailMessage.To.Add(email);

                await smtpClient.SendMailAsync(mailMessage);

                return Ok("Email sent successfully");
            }

            return BadRequest("User not found");
        }

        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetPassword(string email, string token, string newpass)
        {
            var reset = _context.PasswordResets.FirstOrDefault(p => p.Email == email && p.Token == token);
            if (reset == null || (DateTime.Now - reset.CreatedDate).TotalMinutes > 50)
            {
                ModelState.AddModelError("resetpass", "Invalid email or Expired token");
                return BadRequest(ModelState);

            }

            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return NotFound();
            _context.PasswordResets.Remove(reset);
            _context.SaveChanges();

            var tokenreset = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, tokenreset, newpass);
            if (result.Succeeded) return Ok("Password Reset Successfully");
            return BadRequest(result.Errors);


        }




    }
}
