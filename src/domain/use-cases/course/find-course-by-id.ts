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

    async execute( id : string ) : Promise<CourseEntity | null> {
        // Lectura para mostrar: incluye nombre y avatar del profesor, que el detalle del curso
        // necesita. Los checks de propiedad siguen usando findCourseById, más liviano.
        const course = await this.courseRepository.findCourseWithOwnerById( id );
        if( !course ) throw CustomError.notFound(`El curso con el id: ${id}, no fue encontrado`);

        return course;
    }

}