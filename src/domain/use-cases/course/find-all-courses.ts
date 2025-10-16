import { CourseRepository } from "../../repository/course-repository";

import { CourseEntity } from "../../entities/course.entity";
// * VERIFICAR SI NO ROMPE ENCAPSULAMIENTO PORQUE TECNICAMENTE SE ESTA 
// * CONECTANDO CON LA CAPA DE INFRAESTRUCTURA PERO NO SE ESTA UTILIZANDO NINGUNA DEPENDENCIA EXTERNA
import { CourseQueryFilter } from "../../../infraestructure/helpers/CourseQueryBuilder";

export interface FindAllCourseUseCase {
    execute ( filter ?: CourseQueryFilter ) : Promise<CourseEntity[]>
}

export class FindAllCourses implements FindAllCourseUseCase {

    constructor( private readonly courseRepository : CourseRepository) { }

    execute( filter ?: CourseQueryFilter ): Promise<CourseEntity[]> {
        return this.courseRepository.findAllCourses( filter );
    }

}