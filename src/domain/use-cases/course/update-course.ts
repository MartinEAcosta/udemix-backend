import { CourseRepository } from "../../repository/course-repository";

import { CourseEntity } from "../../entities/course.entity";
import { CustomError } from "../../errors/custom-error";
import { UpdateCourseDto } from "../../dtos/course/update-course.dto";
import { FileUploadRepository } from "../../repository/file-upload-repository";
import { UploadFileDto } from "../../dtos/file-upload/file-upload.dto";
import { CategoryRepository } from "../../repository/category-repository";

export interface UpdateCourseUseCase {
    execute( updateCourseDto : UpdateCourseDto , file ?: UploadFileDto ) : Promise<CourseEntity>;
}

export class UpdateCourse implements UpdateCourseUseCase {

    constructor(
        private readonly courseRepository : CourseRepository,
        private readonly fileRepository   : FileUploadRepository,
        private readonly categoryRepository : CategoryRepository, 
    ) {}

    async execute( updateCourseDto: UpdateCourseDto , file ?: UploadFileDto ) : Promise<CourseEntity> {

        if( updateCourseDto.id_category ){
            const category = await this.categoryRepository.findCategoryById( updateCourseDto.id_category );
            if( !category ) throw CustomError.badRequest('La categoria que asignaste al curso no es valida.');
        }
        
        const courseToUpdate = await this.courseRepository.findCourseById( updateCourseDto.id );
        if( !courseToUpdate ) throw CustomError.notFound(`El curso con el id: ${updateCourseDto.id}, no fue encontrado.`);

        if( file ){
            const fileUploaded = await this.fileRepository.uploadFile( file , 'courses');
            if( !fileUploaded ) throw CustomError.internalServer('Hubo un error al subir la portada.'); 

            if( courseToUpdate.id_file ){
                const oldRef = await this.fileRepository.deleteFile( courseToUpdate.id_file );
                if( !oldRef ) throw CustomError.internalServer('Hubo un error al borrar la referencia antigua.');
            }
            return await this.courseRepository.updateCourse(
                                                            {
                                                                ...updateCourseDto , 
                                                                id_file : fileUploaded.id,
                                                                thumbnail_url : fileUploaded.url,
                                                            }
                                                           );
        }
        else{
            return await this.courseRepository.updateCourse( {
                                                                ...updateCourseDto,
                                                             } );
        }
    }

}