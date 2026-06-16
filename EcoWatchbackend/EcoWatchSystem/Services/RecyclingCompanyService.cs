using AutoMapper;
using EcoWatchSystem.Data;
using EcoWatchSystem.DTO;
using EcoWatchSystem.Models;
using EcoWatchSystem.Repositories;
using Microsoft.EntityFrameworkCore;

namespace EcoWatchSystem.Services
{


     public interface IRecyclingCompanyService
{
    Task CreateCompany(RecyclingCompanyDTO companydto);
    Task UpdateCompany(RecyclingCompanyDTO companydto, int companyId);
    Task DeleteCompany(int id);
    Task<RecyclingCompanyResponse> GetCompanyById(int companyId);
    Task<List<RecyclingCompanyResponse>> GetAllCompanies();


}

public class RecyclingCompanyService : IRecyclingCompanyService
{

    private IRecyclingCompanyRepo companyrepo;
    private IMapper _mapper;
        private AppDbContext _context;
        public RecyclingCompanyService(IRecyclingCompanyRepo companyrepo, IMapper _mapper, AppDbContext context)
    {
        this.companyrepo = companyrepo;
         this._mapper = _mapper;
            this._context = context;
    }

        public async Task CreateCompany(RecyclingCompanyDTO companydto)
        {
            string fileName = null; // to save in db

            if (companydto.Logo != null)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/logos");
                if(!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }
                fileName=Guid.NewGuid().ToString()+Path.GetExtension(companydto.Logo.FileName);
                var filepath=Path.Combine(uploadsFolder, fileName);
              using (var stream = new FileStream(filepath, FileMode.Create)) 
                { await companydto.Logo.CopyToAsync(stream); }

                fileName = "/logos/" + fileName;
            }

            var company = _mapper.Map<RecyclingCompany>(companydto);

            company.logo_url = fileName;
            if (companydto.MaterialIds != null)
            {

                var selectedMaterials = await _context.Materials
             .Where(m => companydto.MaterialIds.Contains(m.Id))
             .ToListAsync();

                company.Materials = selectedMaterials;
            }

            await companyrepo.AddCompany(company);

        }

        public async Task DeleteCompany(int id)
        {
            await companyrepo.DeleteCompany(id);
        }

        public async Task<List<RecyclingCompanyResponse>> GetAllCompanies()
        {
            var companies = await companyrepo.GetAllCompanies();
            
           
            return _mapper.Map<List<RecyclingCompanyResponse>>(companies);
        }

        public async Task<RecyclingCompanyResponse> GetCompanyById(int companyId)
        {
            var company = await companyrepo.GetCompanyById(companyId);
            return _mapper.Map<RecyclingCompanyResponse>(company);
        }

        public async Task UpdateCompany(RecyclingCompanyDTO companydto, int companyId)
        {
           
            var company = await companyrepo.GetCompanyById(companyId);
            if (company == null)
                throw new Exception("Company not found");

           
            string oldLogoUrl = company.logo_url;

            
            if (companydto.Logo != null)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/logos");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(companydto.Logo.FileName);
                var filepath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filepath, FileMode.Create))
                {
                    await companydto.Logo.CopyToAsync(stream);
                }

               
                company.logo_url = "/logos/" + fileName;

                
                if (!string.IsNullOrEmpty(oldLogoUrl))
                {
                    var oldFileName = oldLogoUrl.Replace("/logos/", "");
                    var oldFilepath = Path.Combine(uploadsFolder, oldFileName);
                    if (File.Exists(oldFilepath))
                    {
                        File.Delete(oldFilepath);
                    }
                }
            }

            
            _mapper.Map(companydto, company);

         
            await companyrepo.UpdateCompany(company);
        }
    }
}
