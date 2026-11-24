import { CourseRepository } from "../../repository/course-repository";

import { CourseEntity } from "../../entities/course.entity";
import { CustomError } from "../../errors/custom-error";
import { UpdateCourseDto } from "../../dtos/course/update-course.dto";
import { CategoryRepository } from "../../repository/category-repository";

export interface UpdateCourseUseCase {
    execute( updateCourseDto : UpdateCourseDto , id_user : string , role : string ) : Promise<CourseEntity>;
}

/**
 * La portada NO se cambia por acá: el único camino es /api/file (UploadSingle -> setCourseThumbnail).
 *
 * Orden de los chequeos: existencia -> propiedad -> categoría -> cupo. Así un no-dueño recibe
 * 404/401 y nunca un 400 que revele algo sobre el curso.
 */
export class UpdateCourse implements UpdateCourseUseCase {

    constructor(
        private readonly courseRepository : CourseRepository,
        private readonly categoryRepository : CategoryRepository,
    ) {}

    async execute( updateCourseDto: UpdateCourseDto , id_user : string , role : string ) : Promise<CourseEntity> {
        const courseToUpdate = await this.courseRepository.findCourseById( updateCourseDto.id );
        if( !courseToUpdate ) throw CustomError.notFound(`El curso con el id: ${updateCourseDto.id}, no fue encontrado.`);

        if( String( courseToUpdate.id_owner ) !== String( id_user ) && role !== 'admin' ) {
            throw CustomError.unauthorized('No puedes editar un curso que no te pertenece.');
        }

        let toUpdateDto = updateCourseDto;
        if( updateCourseDto.id_category ){
            const category = await this.categoryRepository.findCategoryById( updateCourseDto.id_category );
            if( !category || !category.name ) throw CustomError.badRequest('La categoria que asignaste al curso no es valida.');
            toUpdateDto = UpdateCourseDto.withCategoryName( updateCourseDto , category.name );
        }

        const { capacity } = updateCourseDto;
        if( capacity !== undefined && capacity !== null && capacity < courseToUpdate.current_enrolled ) {
            throw CustomError.badRequest(`La capacidad no puede ser menor a los ${ courseToUpdate.current_enrolled } inscriptos actuales.`);
        }

        return await this.courseRepository.updateCourse( toUpdateDto );
    }

}
