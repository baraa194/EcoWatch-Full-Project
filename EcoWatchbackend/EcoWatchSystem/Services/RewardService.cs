using AutoMapper;
using EcoWatchSystem.Data;
using EcoWatchSystem.DTO;
using EcoWatchSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace EcoWatchSystem.Services
{
    public interface IRewardService
    {
    
        Task<List<RewardDto>> GetAllActiveRewardsAsync();

    
        Task<RewardDto?> GetRewardByIdAsync(int id);

       
        Task<List<RewardDto>> GetAllRewardsForAdminAsync();

       
        Task<RewardDto> AddRewardAsync(RewardRequest dto);

     
        Task<RewardDto?> UpdateRewardAsync(int id, RewardDto dto);

       
        Task<bool> DeleteRewardAsync(int id);
    }

    public class RewardService : IRewardService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public RewardService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<RewardDto>> GetAllActiveRewardsAsync()
        {
            var rewards = await _context.Rewards
                .Where(r => r.IsActive)
                .ToListAsync();

            return _mapper.Map<List<RewardDto>>(rewards);
        }

        public async Task<RewardDto?> GetRewardByIdAsync(int id)
        {
            var reward = await _context.Rewards
                .FirstOrDefaultAsync(r => r.Id == id && r.IsActive);

            return reward == null ? null : _mapper.Map<RewardDto>(reward);
        }

        public async Task<List<RewardDto>> GetAllRewardsForAdminAsync()
        {
            var rewards = await _context.Rewards
                .ToListAsync();

            return _mapper.Map<List<RewardDto>>(rewards);
        }

        public async Task<RewardDto> AddRewardAsync(RewardRequest dto)
        {
            string fileName = null; // to save in db

            if (dto.Image != null)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/logos");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }
                fileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.Image.FileName);
                var filepath = Path.Combine(uploadsFolder, fileName);
                using (var stream = new FileStream(filepath, FileMode.Create))
                { await dto.Image.CopyToAsync(stream); }

                fileName = "/logos/" + fileName;
            }
            var reward = _mapper.Map<Reward>(dto);
            reward.IsActive = true;
            reward.CreatedAt = DateTime.UtcNow;
            reward.ImageUrl = fileName;

            _context.Rewards.Add(reward);
            await _context.SaveChangesAsync();

            return _mapper.Map<RewardDto>(reward);
        }

        public async Task<RewardDto?> UpdateRewardAsync(int id, RewardDto dto)
        {
            var reward = await _context.Rewards.FindAsync(id);
            if (reward == null) return null;

            _mapper.Map(dto, reward); 

            reward.IsActive = dto.IsActive; 

            await _context.SaveChangesAsync();

            return _mapper.Map<RewardDto>(reward);
        }

        public async Task<bool> DeleteRewardAsync(int id)
        {
            var reward = await _context.Rewards.FindAsync(id);
            if (reward == null) return false;

          
            reward.IsActive = false;
            await _context.SaveChangesAsync();


            return true;
        }
    }
}
