import { CourseRepository } from "../../repository/course-repository";

import { CourseEntity } from "../../entities/course.entity";
import { CourseFilterDto } from "../../dtos/course/course-filter.dto";
import { PaginatedResult, PaginationDto } from "../../dtos/shared/pagination.dto";

export interface FindAllCourseUseCase {
    execute ( filter : CourseFilterDto , pagination : PaginationDto ) : Promise<PaginatedResult<CourseEntity[]>>
}

export class FindAllCourses implements FindAllCourseUseCase {

    constructor( private readonly courseRepository : CourseRepository) { }

    async execute ( filter : CourseFilterDto , pagination : PaginationDto ) : Promise<PaginatedResult<CourseEntity[]>> {
        return await this.courseRepository.findAllCourses( filter , pagination );
    }

}
