using EcoWatchSystem.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EcoWatchSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VolunteerController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VolunteerController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("leaderboard")]
        public async Task<IActionResult> GetLeaderboard()
        {
            var topVolunteers = await _context.Volunteers
                .Include(v => v.User)
                .OrderByDescending(v => v.ImpactScore)
                .Take(10)
                .Select(v => new
                {
                    v.Id,
                    Name = v.User.UserName,
                    v.ImpactScore,
                    v.TotalTasksCompleted
                })
                .ToListAsync();

            return Ok(topVolunteers);
        }

        [HttpGet("my-contributions/{userId}")]
        public async Task<IActionResult> MyContributions(string userId)
        {
            var volunteer = await _context.Volunteers
                .FirstOrDefaultAsync(v => v.UserId == userId);

            if (volunteer == null)
                return NotFound("Volunteer not found");

            var posts = await _context.CommunityPosts
                .Where(p => p.ClaimedByVolunteerId == volunteer.Id)
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.Status,
                    p.IsVerified,
                    p.CreatedAt,
                    p.CompletedAt
                })
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return Ok(posts);
        }
    }
}
