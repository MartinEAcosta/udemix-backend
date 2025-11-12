import { CourseRepository } from "../../repository/course-repository";

import { CourseEntity } from "../../entities/course.entity";
// * VERIFICAR SI NO ROMPE ENCAPSULAMIENTO PORQUE TECNICAMENTE SE ESTA 
// * CONECTANDO CON LA CAPA DE INFRAESTRUCTURA PERO NO SE ESTA UTILIZANDO NINGUNA DEPENDENCIA EXTERNA
import { CourseQueryFilter } from "../../helpers/course-query-builder";
import { PaginationDto, PaginationResponseDto } from "../../dtos/shared/pagination.dto";

export interface FindAllCourseUseCase {
    execute ( filter ?: CourseQueryFilter ) : Promise<PaginationResponseDto<CourseEntity[]>>
}

export class FindAllCourses implements FindAllCourseUseCase {

    constructor( private readonly courseRepository : CourseRepository) { }

    async execute ( filter ?: CourseQueryFilter , pagination ?: PaginationDto ) : Promise<PaginationResponseDto<CourseEntity[]>> {

        const info = await this.courseRepository.findAllCourses( filter , pagination );

        return {
            ...info,
            next : pagination!.limit * pagination!.current_page < info.total! ? `/api/courses?current_page=${ (pagination!.current_page+1) }&limit=${ pagination!.limit }` : null,
            prev : (pagination!.current_page - 1) > 0   ? `/api/courses?current_page=${ (pagination!.current_page-1) }&limit=${ pagination!.limit }` : null, 
        };
    }

}