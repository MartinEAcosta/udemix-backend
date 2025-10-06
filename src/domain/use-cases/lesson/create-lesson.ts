import { CreateLessonDto } from "../../dtos/lesson/create-lesson.dto";
import { LessonEntity } from "../../entities/lesson.entity";
import { CustomError } from "../../errors/custom-error";
import { LessonRepository } from "../../repository/lesson-repository";
import { CourseRepository } from '../../repository/course-repository';
import { UploadFileDto } from "../../dtos/file-upload/file-upload.dto";
import { FileUploadRepository } from "../../repository/file-upload-repository";

interface CreateLessonUseCase {
    execute( lessonRequestDto : CreateLessonDto , file ?: UploadFileDto ) : Promise<LessonEntity>;
}

export class CreateLesson implements CreateLessonUseCase {

    constructor( 
        private readonly courseRepository : CourseRepository,
        private readonly lessonRepository : LessonRepository,
        private readonly fileRepository   : FileUploadRepository,
    ) { }

    async execute( lessonRequestDto : CreateLessonDto , file ?: UploadFileDto ) : Promise<LessonEntity> {

        const { id_course } = lessonRequestDto;
        const course = await this.courseRepository.findCourseById( id_course );
        if( !course ) throw CustomError.notFound("El curso al que quieres asignar la lección no existe.");
        
        if( course.id_owner != lessonRequestDto.id_user ) throw CustomError.unauthorized('No eres el propietario, por lo tanto no puedes añadir lecciones.');

        const arrayLessons = await this.lessonRepository.findAllLessonsByCourseId( id_course );
        const lastLesson = arrayLessons.pop();
        const { lesson_number , ...rest } = lessonRequestDto;
                                        
        if( file ){

            const fileUploaded = await this.fileRepository.uploadFile( file , 'lessons' );
            if( !fileUploaded ) throw CustomError.internalServer( 'Hubo un error al intentar cargar el contenido a la lección.');

            return await this.lessonRepository.createLesson(
                                                            { 
                                                                ...rest,
                                                                lesson_number : lastLesson ? lastLesson.lesson_number+1 : 0,
                                                                id_file : fileUploaded.id
                                                            } 
                                                           );
        }
        else{
            return await this.lessonRepository.createLesson( 
                                                            {
                                                                ...rest,
                                                                lesson_number : lastLesson ? lastLesson.lesson_number+1 : 0,
                                                            } 
                                                           );
        }
    }
    
}