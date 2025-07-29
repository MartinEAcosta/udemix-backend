import { CourseRepository } from "../../repository/course-repository";

import { CourseEntity } from "../../entities/course.entity";

export interface GetAllCourseUseCase {
    execute ( ) : Promise<CourseEntity[]>
}

export class GetAllCourses implements GetAllCourseUseCase {

    constructor( private readonly courseRepository : CourseRepository) { }

    execute( ): Promise<CourseEntity[]> {
        return this.courseRepository.getAllCourses();
    }

}