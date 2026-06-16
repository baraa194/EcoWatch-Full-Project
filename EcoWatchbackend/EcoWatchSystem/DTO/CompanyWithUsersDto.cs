namespace EcoWatchSystem.DTO
{
    public class CompanyWithUsersDto
    {

        public int CompanyId { get; set; }
        public string CompanyName { get; set; }
        public List<usersOfcompanyDTO> Users { get; set; }
    }
}
