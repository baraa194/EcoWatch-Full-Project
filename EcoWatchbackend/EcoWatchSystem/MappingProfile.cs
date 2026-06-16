using AutoMapper;
using EcoWatchSystem.DTO;
using EcoWatchSystem.Models;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // ?? Reports Mapping
        CreateMap<ReportRequest, Reports>().ReverseMap();


        CreateMap<Reports, ReportDetailsDto>()
       .ForMember(dest => dest.Username, opt => opt.
       MapFrom(src => src.User != null ? src.User.UserName : string.Empty))
       .ReverseMap();

        // ?? Authorities Mapping
        CreateMap<AuthorityDto, Authorities>()
         .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.ContactEmail))
         .ForMember(dest => dest.Region, opt => opt.MapFrom(src => src.Region))
         .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
         .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
         .ReverseMap()
         .ForMember(dest => dest.ContactEmail, opt => opt.MapFrom(src => src.Email))
         .ForMember(dest => dest.Region, opt => opt.MapFrom(src => src.Region))
         .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
         .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id));

        // ?? Rules Mapping
        CreateMap<EmailRoutingRules, RuleDto>()
                .ForMember(dest => dest.AuthorityName, opt => opt.MapFrom(src => src.Authority.Name))
                .ForMember(dest => dest.AuthorityEmail, opt => opt.MapFrom(src => src.Authority.Email))
                .ReverseMap();

        // ?? Email Queue Mapping
        CreateMap<EmailQueue, EmailQueueDto>()
      .ForMember(dest => dest.ReportTitle,
          opt => opt.MapFrom(src => src.Report != null ? src.Report.Title : null))
      .ForMember(dest => dest.AuthorityName,
          opt => opt.MapFrom(src =>
              src.RoutingRule != null && src.RoutingRule.Authority != null
                  ? src.RoutingRule.Authority.Name
                  : null))
      .ForMember(dest => dest.Status,
               opt => opt.MapFrom(src => src.Report != null
                   ? src.Report.Status.ToString()
                   : "Unknown"))
       .ForMember(dest => dest.reportId,

         opt => opt.MapFrom(src => src.Report != null ? src.Report.Id : 0));





        //EmailQueue <-> EmailQueueDto Mapping
        CreateMap<EmailQueue, EmailQueueDto>()
            .ForMember(dest => dest.ReportTitle,
                opt => opt.MapFrom(src => src.Report != null ? src.Report.Title : null))
            .ForMember(dest => dest.AuthorityName,
                opt => opt.MapFrom(src =>
                    src.RoutingRule != null && src.RoutingRule.Authority != null
                        ? src.RoutingRule.Authority.Name
                        : null))
             .ForMember(dest => dest.Status,
               opt => opt.MapFrom(src => src.Report != null
                   ? src.Report.Status.ToString()
                   : "Unknown"))
                    .ForMember(dest => dest.reportId,

         opt => opt.MapFrom(src => src.Report != null ? src.Report.Id : 0))
            .ReverseMap();


        CreateMap<RecyclingCompanyDTO, RecyclingCompany>().ReverseMap()
              .ForMember(dest => dest.Logo, opt => opt.Ignore());
        CreateMap<RecyclingCompany, RecyclingCompanyResponse>()
    .ForMember(dest => dest.MaterialNames,
               opt => opt.MapFrom(src => src.Materials.Select(cm => cm.Name)))
    .ForMember(dest => dest.Logo_url,
               opt => opt.MapFrom(src => src.logo_url));

        CreateMap<RecyclingCompanyResponse, RecyclingCompany>()
            .ForMember(dest => dest.logo_url,
                       opt => opt.MapFrom(src => src.Logo_url));


        // ?? Recycling Mapping
        CreateMap<RecyclingRequest, RecyclingResponseDto>();


        CreateMap<Reward, RewardRequest>();
        CreateMap<Reward, RewardRequest>().ReverseMap();

        CreateMap<Reward, RewardDto>().ReverseMap();
        CreateMap<Reports, AuthorityReportDTO>()
            .ForMember(dest => dest.ReportId, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.ReportStatus, opt => opt.MapFrom(src => src.Status))
            .ForMember(dest => dest.ReportDate, opt => opt.MapFrom(src => src.CreatedAt));


        // ====================== Community Posts Mapping (??????) ======================

 
        CreateMap<CreatePostDto, CommunityPost>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => "Open"))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));

    
        CreateMap<CommunityPost, PostDto>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src =>
                src.User != null ? src.User.UserName : string.Empty))
            .ForMember(dest => dest.ClaimedByVolunteerName, opt => opt.MapFrom(src =>
                src.ClaimedByVolunteer != null && src.ClaimedByVolunteer.User != null
                    ? src.ClaimedByVolunteer.User.UserName
                    : null));




    }
}
