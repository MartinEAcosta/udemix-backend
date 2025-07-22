import { CourseEntity } from "../../entities/course.entity";
import { CourseRepository } from "../../repository/course-repository";

export interface GetCourseByIdUseCase {
    execute( id : string ) : Promise<CourseEntity>;
}

export class GetCourseById implements GetCourseByIdUseCase {

    constructor(
        private readonly courseRepository : CourseRepository, 
    ) {}

    execute(id: string): Promise<CourseEntity> {
        return this.courseRepository.getCourseById( id );
    }

}