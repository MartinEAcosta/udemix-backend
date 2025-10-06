import { CourseRepository } from "../../repository/course-repository";

import { CourseEntity } from "../../entities/course.entity";
import { CreateCourseDto } from "../../dtos/course/create-course.dto";
import { FileUploadRepository } from "../../repository/file-upload-repository";
import { CustomError } from "../../errors/custom-error";
import { UploadFileDto } from "../../dtos/file-upload/file-upload.dto";

export interface SaveCourseUseCase {
    execute( createCourseDto : CreateCourseDto , file ?: UploadFileDto ) : Promise<CourseEntity>;
}

export class SaveCourse implements SaveCourseUseCase {
    
    constructor(
        private readonly courseRepository : CourseRepository, 
        private readonly fileRepository : FileUploadRepository
    ) {}

    async execute( createCourseDto : CreateCourseDto , file ?: UploadFileDto ) : Promise<CourseEntity> {

        if( file ){
            const fileUploaded = await this.fileRepository.uploadFile( file , 'courses');
            if( !fileUploaded ) throw CustomError.internalServer('Hubo un error al subir el archivo.');

            return await this.courseRepository.saveCourse( 
                                                            { 
                                                                ...createCourseDto , 
                                                                id_file : fileUploaded.id.toString(),
                                                                thumbnail_url : fileUploaded.url,
                                                            }
                                                        );
        }
        else{
            return this.courseRepository.saveCourse( createCourseDto );
        }
        
    }

}