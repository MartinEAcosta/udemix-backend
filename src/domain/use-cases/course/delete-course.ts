import { CustomError } from "../../errors/custom-error";
import { CourseRepository } from "../../repository/course-repository";

export interface DeleteCourseUseCase {
    execute( id : string ) : Promise<boolean>;
}

export class DeleteCourse implements DeleteCourseUseCase {

    constructor(
        private readonly courseRepository : CourseRepository, 
    ) {}

    async execute(id: string): Promise<boolean> {
        const courseToRemove = await this.courseRepository.getCourseById( id );
        if(courseToRemove === null) throw CustomError.notFound(`El curso con el id: ${id}, no fue encontrado`);

        const hasRemoved = await this.courseRepository.deleteCourse( id );
        return hasRemoved;
    }

}