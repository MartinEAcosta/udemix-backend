import { CourseEntity } from "../../entities/course.entity";
import { CustomError } from "../../errors/custom-error";
import { CourseRepository } from "../../repository";

interface FindCoursesByIdsUseCase {
    execute( id_courses : string[] ) : Promise<CourseEntity[]>;
}

export class FindCoursesByIds implements FindCoursesByIdsUseCase {

    constructor( 
        private readonly courseRepository : CourseRepository,
     ){ }

    async execute( id_courses : string[] ): Promise<CourseEntity[]> {

        const courses = await this.courseRepository.findCoursesByIds( id_courses );
        if( courses.length === 0 ) throw CustomError.badRequest('No se encontraron los cursos indicados.')
        if( courses.length != id_courses.length ) throw CustomError.badRequest('Uno de los cursos que indicaste no se ha encontrado.'); 
        
        return courses;
    }


}