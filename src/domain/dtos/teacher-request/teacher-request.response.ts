import { ExperienceLevel, TeacherRequestStatus } from "../../entities/teacher-request.entity";

export interface TeacherRequestResponseDto {
    id               : string,
    id_user          : string,
    status           : TeacherRequestStatus,
    about_you        : string,
    category_ids     : string[],
    experience_level : ExperienceLevel,
    course_title     : string,
    course_summary   : string,
    created_at       : Date,
    portfolio_url    : string | null,
    reviewed_at      : Date | null,
    rejection_reason : string | null,
}
