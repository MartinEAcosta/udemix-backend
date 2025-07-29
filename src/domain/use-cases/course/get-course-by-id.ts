import { CourseRepository } from "../../repository/course-repository";

import { CourseEntity } from "../../entities/course.entity";
import { CustomError } from "../../errors/custom-error";

export interface GetCourseByIdUseCase {
    execute( id : string ) : Promise<CourseEntity | null>;
}

export class GetCourseById implements GetCourseByIdUseCase {

    constructor(
        private readonly courseRepository : CourseRepository, 
    ) {}

    async execute(id: string): Promise<CourseEntity | null> {
        const course = await this.courseRepository.getCourseById( id );
        if( !course ) throw CustomError.notFound(`El curso con el id: ${id}, no fue encontrado`);

        return course;
    }

}