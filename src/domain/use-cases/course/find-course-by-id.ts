import { CourseRepository } from "../../repository/course-repository";

import { CourseEntity } from "../../entities/course.entity";
import { CustomError } from "../../errors/custom-error";

export interface FindCourseByIdUseCase {
    execute( id : string ) : Promise<CourseEntity | null>;
}

export class FindCourseById implements FindCourseByIdUseCase {

    constructor(
        private readonly courseRepository : CourseRepository, 
    ) {}

    async execute(id: string): Promise<CourseEntity | null> {
        const course = await this.courseRepository.findCourseById( id );
        if( !course ) throw CustomError.notFound(`El curso con el id: ${id}, no fue encontrado`);

        return course;
    }

}