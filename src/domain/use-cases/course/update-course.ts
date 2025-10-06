import { CourseRepository } from "../../repository/course-repository";

import { CourseEntity } from "../../entities/course.entity";
import { CustomError } from "../../errors/custom-error";
import { UpdateCourseDto } from "../../dtos/course/update-course.dto";
import { FileUploadRepository } from "../../repository/file-upload-repository";

export interface UpdateCourseUseCase {
    execute( updateCourseDto : UpdateCourseDto ) : Promise<CourseEntity>;
}

export class UpdateCourse implements UpdateCourseUseCase {

    constructor(
        private readonly courseRepository : CourseRepository,
        private readonly fileRepository   : FileUploadRepository 
    ) {}

    async execute( updateCourseDto: UpdateCourseDto ) : Promise<CourseEntity> {

        const courseToUpdate = await this.courseRepository.findCourseById( updateCourseDto.id );
        if( !courseToUpdate ) throw CustomError.notFound(`El curso con el id: ${updateCourseDto.id}, no fue encontrado.`);
        let updatedCourse;

        if( updateCourseDto.id_file != null ){
            const fileToAssign = await this.fileRepository.findFileById( updateCourseDto.id_file );
            const urlToAssign = fileToAssign?.url;

            if( courseToUpdate.id_file != null && ( updateCourseDto.id_file.toString() != courseToUpdate.id_file.toString() ) ){
                const oldRef = await this.fileRepository.deleteFile( courseToUpdate.id_file );
                if( !oldRef ) throw CustomError.internalServer('Hubo un error al borrar la referencia antigua.');
            }
            updatedCourse = await this.courseRepository.updateCourse(
                                                                        {
                                                                            ...updateCourseDto , 
                                                                            thumbnail_url : urlToAssign,
                                                                        }
                                                                    )
        }
        else{
            updatedCourse = await this.courseRepository.updateCourse( {
                                                                            ...updateCourseDto,
                                                                            } );
        }

        return {
           ...updatedCourse
        };
    }

}