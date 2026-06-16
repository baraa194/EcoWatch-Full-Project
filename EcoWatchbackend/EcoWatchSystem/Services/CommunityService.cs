using AutoMapper;
using EcoWatchSystem.Data;
using EcoWatchSystem.DTO;
using EcoWatchSystem.Enums;
using EcoWatchSystem.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace EcoWatchSystem.Services
{
    public interface ICommunityService
    {
        Task<PostDto> CreatePostAsync(CreatePostDto dto, string userId);
        Task<List<PostDto>> GetAllPostsAsync();
        Task<List<PostDto>> GetNearbyPostsAsync(string locationKeyword);
        Task<PostDto> GetPostByIdAsync(int postId);

        Task<bool> ClaimPostAsync(int postId, string volunteerUserId, ClaimPostDto? dto = null);
        Task<bool> CancelClaimAsync(int postId, string volunteerUserId);

 
        public Task<bool> MarkPostAsCompletedAsync(int postId, string volunteerUserId, CompletePostDto dto);

      
        public Task<bool> AdminReviewPostAsync(int postId, string adminUserId, AdminReviewDto dto);

        Task<List<PostDto>> GetMyPostsAsync(string userId);
        public Task<List<AdminCommunityPostDto>> GetAllPostsForAdminAsync();
    }

    public class CommunityService : ICommunityService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public CommunityService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

       
        public async Task<PostDto> CreatePostAsync(CreatePostDto dto, string userId)
        {
            string? imageUrl = null;

            if (dto.Image != null && dto.Image.Length > 0)
            {
                var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads/posts");
                Directory.CreateDirectory(uploadsDir);

                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(dto.Image.FileName)}";
                var filePath = Path.Combine(uploadsDir, fileName);

                using var stream = new FileStream(filePath, FileMode.Create);
                await dto.Image.CopyToAsync(stream);

                imageUrl = $"/uploads/posts/{fileName}";
            }

            var post = new CommunityPost
            {
                UserId = userId,
                Title = dto.Title,
                Description = dto.Description,
                Location = dto.Location,
                Category = dto.Category,
                ImageUrl = imageUrl,
                Status = PostStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            _context.CommunityPosts.Add(post);
            await _context.SaveChangesAsync();

            return _mapper.Map<PostDto>(post);
        }

       
        public async Task<List<PostDto>> GetAllPostsAsync()
        {
            var posts = await _context.CommunityPosts
                .Include(p => p.User)
                .Include(p => p.ClaimedByVolunteer)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return _mapper.Map<List<PostDto>>(posts);
        }

        public async Task<List<PostDto>> GetNearbyPostsAsync(string locationKeyword)
        {
            var posts = await _context.CommunityPosts
                .Include(p => p.User)
                .Where(p => p.Status == PostStatus.Pending &&
                            p.Location.ToLower().Contains(locationKeyword.ToLower()))
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return _mapper.Map<List<PostDto>>(posts);
        }

        public async Task<PostDto> GetPostByIdAsync(int postId)
        {
            var post = await _context.CommunityPosts
                .Include(p => p.User)
                .Include(p => p.ClaimedByVolunteer)
                .FirstOrDefaultAsync(p => p.Id == postId);

            if (post == null) throw new Exception("Post not found");

            return _mapper.Map<PostDto>(post);
        }

     
        public async Task<bool> ClaimPostAsync(int postId, string volunteerUserId, ClaimPostDto? dto = null)
        {
            var post = await _context.CommunityPosts.FindAsync(postId);
            if (post == null || post.Status != PostStatus.Pending)
                return false;

            var volunteer = await _context.Volunteers
                .FirstOrDefaultAsync(v => v.UserId == volunteerUserId && v.IsActive);

            if (volunteer == null)
                throw new Exception("User is not a volunteer");

            post.ClaimedByVolunteerId = volunteer.Id;
            post.ClaimedAt = DateTime.UtcNow;
            post.Status = PostStatus.InProgress;

            await _context.SaveChangesAsync();
            return true;
        }

    
        public async Task<bool> CancelClaimAsync(int postId, string volunteerUserId)
        {
            var post = await _context.CommunityPosts.FindAsync(postId);
            if (post == null || post.Status != PostStatus.InProgress)
                return false;

            post.ClaimedByVolunteerId = null;
            post.ClaimedAt = null;
            post.Status = PostStatus.Pending;

            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<List<AdminCommunityPostDto>> GetAllPostsForAdminAsync()
        {
            return await _context.CommunityPosts
                .Include(p => p.ClaimedByVolunteer)
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new AdminCommunityPostDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Description = p.Description,
                    Location = p.Location,
                    Category = p.Category,
                    Status = p.Status.ToString(),

                    ImageUrl = p.ImageUrl,
                    BeforeImageUrl = p.BeforeImageUrl,
                    AfterImageUrl = p.AfterImageUrl,

                    Notes = p.Notes,
                    PointsReward = p.PointsReward,

                    UserId = p.UserId,

                    ClaimedByVolunteerId = p.ClaimedByVolunteerId,
                    ClaimedByVolunteerUserId = p.ClaimedByVolunteer != null
        ? p.ClaimedByVolunteer.UserId
        : null,

                    ClaimedByVolunteerName = p.ClaimedByVolunteer != null
        ? p.ClaimedByVolunteer.User.UserName
        : null,

                    VolunteerImpactScore = p.ClaimedByVolunteer != null
        ? p.ClaimedByVolunteer.ImpactScore
        : null,

                    IsVerified = p.IsVerified,
                    VerifiedByUserId = p.VerifiedByUserId,
                    RejectionReason = p.RejectionReason,

                    CreatedAt = p.CreatedAt,
                    ClaimedAt = p.ClaimedAt,
                    CompletedAt = p.CompletedAt,
                    VerifiedAt = p.VerifiedAt
                }).ToListAsync();
        }


       
        public async Task<bool> MarkPostAsCompletedAsync(
            int postId,
            string volunteerUserId,
            CompletePostDto dto)
        {
            var post = await _context.CommunityPosts
                .Include(p => p.ClaimedByVolunteer)
                .FirstOrDefaultAsync(p => p.Id == postId);

            if (post == null )
                return false;

           
            var volunteer = await _context.Volunteers
                .FirstOrDefaultAsync(v => v.UserId == volunteerUserId);

       

            if (dto.AfterImage != null && dto.AfterImage.Length > 0)
            {
                var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads/proof");
                Directory.CreateDirectory(uploadsDir);

                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(dto.AfterImage.FileName)}";
                var filePath = Path.Combine(uploadsDir, fileName);

                using var stream = new FileStream(filePath, FileMode.Create);
                await dto.AfterImage.CopyToAsync(stream);

                post.AfterImageUrl = $"/uploads/proof/{fileName}";
            }

            post.Notes = dto.Notes;
            post.Status = PostStatus.Completed; 
            post.CompletedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

    
        public async Task<bool> AdminReviewPostAsync(int postId, string adminUserId, AdminReviewDto dto)
        {
            var post = await _context.CommunityPosts
                .Include(p => p.ClaimedByVolunteer)
                .FirstOrDefaultAsync(p => p.Id == postId);

            if (post == null || post.Status != PostStatus.Completed)
                return false;

            post.VerifiedByUserId = adminUserId;
            post.VerifiedAt = DateTime.UtcNow;

            if (dto.Approved)
            {
                post.Status = PostStatus.Verified;
                post.IsVerified = true;
                post.RejectionReason = null;

            
                if (post.ClaimedByVolunteer != null)
                {
                    post.ClaimedByVolunteer.ImpactScore += post.PointsReward;
                    post.ClaimedByVolunteer.TotalTasksCompleted += 1;
                }
            }
            else
            {
                post.Status = PostStatus.Rejected;
                post.IsVerified = false;
                post.RejectionReason = dto.RejectionReason;
            }

            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<List<PostDto>> GetMyPostsAsync(string userId)
        {
            var posts = await _context.CommunityPosts
                .Include(p => p.User)
                .Include(p => p.ClaimedByVolunteer)
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return _mapper.Map<List<PostDto>>(posts);
        }
    }
}