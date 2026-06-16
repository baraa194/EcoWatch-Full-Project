namespace EcoWatchSystem.Models
{
    public class Material
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int PointsPerKg { get; set; }
        public ICollection<RecyclingCompany> Companies { get; set; }
    }
}
