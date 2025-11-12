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

        const { current_page , limit } = paginationDto;
        const info = await this.courseRepository.findCoursesPaginated( current_page , limit );

        return {
            ...info,
            next : limit * current_page < info.total! ? `/api/courses?current_page=${ (current_page+1) }&limit=${ limit }` : null,
            prev : (current_page - 1) > 0   ? `/api/courses?current_page=${ (current_page-1) }&limit=${ limit }` : null, 
        };
    }
}