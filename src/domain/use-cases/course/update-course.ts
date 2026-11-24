import { CourseRepository } from "../../repository/course-repository";

import { CourseEntity } from "../../entities/course.entity";
import { CustomError } from "../../errors/custom-error";
import { UpdateCourseDto } from "../../dtos/course/update-course.dto";
import { FileRepository } from "../../repository/file-repository";
import { UploadFileDto } from "../../dtos/file/file.dto";
import { CategoryRepository } from "../../repository/category-repository";

export interface UpdateCourseUseCase {
    execute( updateCourseDto : UpdateCourseDto , id_user : string , role : string , file ?: UploadFileDto ) : Promise<CourseEntity>;
}

export class UpdateCourse implements UpdateCourseUseCase {

    constructor(
        private readonly courseRepository : CourseRepository,
        private readonly fileRepository   : FileRepository,
        private readonly categoryRepository : CategoryRepository,
    ) {}

    async execute( updateCourseDto: UpdateCourseDto , id_user : string , role : string , file ?: UploadFileDto ) : Promise<CourseEntity> {
        let toUpdateDto = updateCourseDto;
        if( updateCourseDto.id_category ){
            const category = await this.categoryRepository.findCategoryById( updateCourseDto.id_category );
            if( !category ) throw CustomError.badRequest('La categoria que asignaste al curso no es valida.');
            toUpdateDto = UpdateCourseDto.withCategoryName( updateCourseDto , category.name );
        }

        const courseToUpdate = await this.courseRepository.findCourseById( updateCourseDto.id );
        if( !courseToUpdate ) throw CustomError.notFound(`El curso con el id: ${updateCourseDto.id}, no fue encontrado.`);

        if( courseToUpdate.id_owner != id_user && role !== 'admin' ) {
            throw CustomError.unauthorized('No puedes editar un curso que no te pertenece.');
        }

        else{
            // No hace falta forzar el id_owner acá: UpdateCourseDto ya no lo declara,
            // así que el update genérico no puede reasignar el dueño del curso.
            return await this.courseRepository.updateCourse( toUpdateDto );
        }
    }

}