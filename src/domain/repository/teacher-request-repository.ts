import { PaginatedResult, PaginationDto } from "../dtos/shared/pagination.dto";
import { CreateTeacherRequestDto } from "../dtos/teacher-request/create-teacher-request.dto";
import { ReviewTeacherRequestDto } from "../dtos/teacher-request/review-teacher-request.dto";
import { TeacherRequestFilterDto } from "../dtos/teacher-request/teacher-request-filter.dto";
import { TeacherRequestEntity } from "../entities/teacher-request.entity";

export abstract class TeacherRequestRepository {

    abstract findAllTeacherRequests( filter : TeacherRequestFilterDto , pagination : PaginationDto ) : Promise<PaginatedResult<TeacherRequestEntity[]>>;
    abstract findTeacherRequestById( id : string ) : Promise<TeacherRequestEntity | null>;
    abstract findTeacherRequestsByUserId( id_user : string ) : Promise<TeacherRequestEntity[]>;
    abstract createTeacherRequest( createTeacherRequestDto : CreateTeacherRequestDto ) : Promise<TeacherRequestEntity>;
    abstract reviewTeacherRequest( reviewTeacherRequestDto : ReviewTeacherRequestDto ) : Promise<TeacherRequestEntity>;
    abstract deleteTeacherRequest( id : string ) : Promise<boolean>;

}
