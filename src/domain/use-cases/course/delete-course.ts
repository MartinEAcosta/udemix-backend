import { CourseRepository } from "../../repository/course-repository";

export interface DeleteCourseUseCase {
    execute( id : string ) : Promise<boolean>;
}

export class DeleteCourse implements DeleteCourseUseCase {

    constructor(
        private readonly courseRepository : CourseRepository, 
    ) {}

    execute(id: string): Promise<boolean> {
        return this.courseRepository.deleteCourse( id );
    }

}