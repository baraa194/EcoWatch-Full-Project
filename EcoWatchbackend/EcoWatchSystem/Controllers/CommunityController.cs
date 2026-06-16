using EcoWatchSystem.DTO;
using EcoWatchSystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EcoWatchSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommunityController : ControllerBase
    {
        private readonly ICommunityService _service;

        public CommunityController(ICommunityService service)
        {
            _service = service;
        }

        
        [HttpPost("posts")]
        public async Task<IActionResult> CreatePost([FromForm] CreatePostDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var result = await _service.CreatePostAsync(dto, userId);
            return Ok(result);
        }

   
        [HttpGet("posts")]
        public async Task<IActionResult> GetAllPosts()
        {
            var posts = await _service.GetAllPostsAsync();
            return Ok(posts);
        }

       
        [HttpGet("posts/nearby")]
        public async Task<IActionResult> GetNearbyPosts([FromQuery] string location)
        {
            var posts = await _service.GetNearbyPostsAsync(location);
            return Ok(posts);
        }

      
       
        [HttpPost("posts/{postId}/claim")]
        public async Task<IActionResult> ClaimPost(int postId, [FromBody] ClaimPostDto? dto = null)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            bool success = await _service.ClaimPostAsync(postId, userId, dto);

            return success
                ? Ok(new { message = "Task claimed successfully" })
                : BadRequest("Cannot claim this task");
        }

      
        [HttpPost("posts/{postId}/complete")]
        public async Task<IActionResult> MarkAsCompleted(int postId, [FromForm] CompletePostDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var result = await _service.MarkPostAsCompletedAsync(postId, userId, dto);

            if (!result)
                return BadRequest("Cannot complete this post. Make sure you are the volunteer who claimed it and it is InProgress.");

            return Ok(new { message = "Task submitted for admin review." });
        }

      
        [HttpPost("admin/posts/{postId}/review")]
        public async Task<IActionResult> ReviewPost(int postId, [FromBody] AdminReviewDto dto)
        {
            var adminUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
         

            var result = await _service.AdminReviewPostAsync(postId, adminUserId, dto);

            if (!result)
                return BadRequest("Post cannot be reviewed. Make sure it has Status = Completed.");

            return Ok(new
            {
                message = dto.Approved
                    ? "Post verified. Points added to volunteer."
                    : "Post rejected.",
                approved = dto.Approved
            });
        }

        [HttpGet("my-posts")]
        public async Task<IActionResult> GetMyPosts()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var posts = await _service.GetMyPostsAsync(userId);

            return Ok(posts);
        }
        [HttpGet("admin/posts")]
   
        public async Task<IActionResult> GetAllPostsForAdmin()
        {
            var posts = await _service.GetAllPostsForAdminAsync();
            return Ok(posts);
        }
    }
}
