namespace EcoWatchSystem.DTO
{
    
        public class MLReportRequestDto
        {
            public string report_date { get; set; }
            public string governorate { get; set; }
            public string city { get; set; }
            public double longitude { get; set; }
            public double latitude { get; set; }
            public string issue_type { get; set; }
            public string report_headline { get; set; }
            public string report_detail { get; set; }
            public string report_category { get; set; }
            public int proximity_to_service { get; set; }
            public int repetition_flag { get; set; }
        }
    

}
