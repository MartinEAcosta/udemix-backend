import { PaginationDto, PaginationResponseDto } from "../../dtos/shared/pagination.dto";
import { CourseEntity } from "../../entities/course.entity";
import { CourseRepository } from "../../repository/course-repository";

export interface FindCoursesPaginatedUseCase {

    execute ( paginationDto : PaginationDto ) : Promise<PaginationResponseDto<CourseEntity[]>>;
}

export class FindCoursesPaginated implements FindCoursesPaginatedUseCase {

    constructor( 
        private readonly courseRepository : CourseRepository,
    ) { }

    async execute( paginationDto : PaginationDto ) : Promise<PaginationResponseDto<CourseEntity[]>> {

        const { page , limit } = paginationDto;
        const info = await this.courseRepository.findCoursesPaginated( page , limit );

        return {
            ...info,
            next : limit * page < info.total ? `/api/courses?page=${ (page+1) }&limit=${ limit }` : null,
            prev : (page - 1) > 0   ? `/api/courses?page=${ (page-1) }&limit=${ limit }` : null, 
        };
    }
}