import { CourseEntity } from "../../entities/course.entity";
import { CourseRepository } from "../../repository/course.repository";

export interface GetAllCourseUseCase {
    execute ( ) : Promise<CourseEntity[]>
}

export class GetAllCourses implements GetAllCourseUseCase {

    constructor( private readonly courseRepository : CourseRepository) { }

    execute( ): Promise<CourseEntity[]> {
        return this.courseRepository.getAllCourses();
    }

}