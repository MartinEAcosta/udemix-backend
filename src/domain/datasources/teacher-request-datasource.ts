import { PaginatedResult, PaginationDto } from "../dtos/shared/pagination.dto";
import { CreateTeacherRequestDto } from "../dtos/teacher-request/create-teacher-request.dto";
import { ReviewTeacherRequestDto } from "../dtos/teacher-request/review-teacher-request.dto";
import { TeacherRequestFilterDto } from "../dtos/teacher-request/teacher-request-filter.dto";
import { TeacherRequestResponseDto } from "../dtos/teacher-request/teacher-request.response";

export abstract class TeacherRequestDatasource {

    abstract findAllTeacherRequests( filter : TeacherRequestFilterDto , pagination : PaginationDto ) : Promise<PaginatedResult<TeacherRequestResponseDto[]>>;
    abstract findTeacherRequestById( id : string ) : Promise<TeacherRequestResponseDto | null>;
    abstract findTeacherRequestsByUserId( id_user : string ) : Promise<TeacherRequestResponseDto[]>;
    abstract createTeacherRequest( createTeacherRequestDto : CreateTeacherRequestDto ) : Promise<TeacherRequestResponseDto>;
    abstract reviewTeacherRequest( reviewTeacherRequestDto : ReviewTeacherRequestDto ) : Promise<TeacherRequestResponseDto>;
    abstract deleteTeacherRequest( id : string ) : Promise<boolean>;

}
