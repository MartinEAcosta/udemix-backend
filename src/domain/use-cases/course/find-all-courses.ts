import { CourseRepository } from "../../repository/course-repository";

import { CourseEntity } from "../../entities/course.entity";

export interface FindAllCourseUseCase {
    execute ( ) : Promise<CourseEntity[]>
}

export class FindAllCourses implements FindAllCourseUseCase {

    constructor( private readonly courseRepository : CourseRepository) { }

    execute( ): Promise<CourseEntity[]> {
        return this.courseRepository.findAllCourses();
    }

}