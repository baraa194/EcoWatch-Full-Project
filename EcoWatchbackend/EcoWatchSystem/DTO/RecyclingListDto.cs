namespace EcoWatchSystem.DTO
{
    public class RecyclingListDto
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string MaterialType { get; set; }
        public double Weight { get; set; }
        public int PointsEarned { get; set; }
        public DateTime CreatedAt { get; set; }
    }

}
