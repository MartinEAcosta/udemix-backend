import { CreateLessonDto } from "../../dtos/lesson/create-lesson.dto";
import { LessonEntity } from "../../entities/lesson.entity";
import { CustomError } from "../../errors/custom-error";
import { LessonRepository } from "../../repository/lesson-repository";
import { CourseRepository } from '../../repository/course-repository';
import { UploadFileDto } from "../../dtos/file/file.dto";
import { FileRepository } from "../../repository/file-repository";
import { ModuleRepository } from "../../repository/module-repository";
import { UnitOfWork } from "../../services/UnitOfWork";

interface CreateLessonUseCase {
    execute( createLessonDto : CreateLessonDto , id_user : string , file ?: UploadFileDto  ) : Promise<LessonEntity>;
}

export class CreateLesson implements CreateLessonUseCase {

    constructor( 
        private readonly lessonRepository : LessonRepository,
        private readonly moduleRepository : ModuleRepository,
        private readonly courseRepository : CourseRepository,
        private readonly unitOfWork       : UnitOfWork,
    ) { }

    async execute( createLessonDto : CreateLessonDto , id_user : string ) : Promise<LessonEntity> {
        const { id_course } = createLessonDto;
        console.log(createLessonDto);
        const course = await this.courseRepository.findCourseById( id_course );
        if( !course ) throw CustomError.notFound("El curso al que quieres asignar la lección no existe.");
        
        if( course.id_owner != id_user ) throw CustomError.unauthorized('No eres el propietario, por lo tanto no puedes añadir lecciones.');
        
        const module = await this.moduleRepository.findModuleById( createLessonDto.id_module );
        if( !module ) throw CustomError.notFound("El modulo al que quieres asignar la lección no existe.");
        if( module.id_course != id_course ) throw CustomError.badRequest('El modulo al que intentas asignar la lección no pertenece al curso en cuestion.')

        const arrayLessons = await this.lessonRepository.findAllLessonsByCourseId( id_course );
        const lastLesson = arrayLessons.pop();
        const { lesson_number , ...rest } = createLessonDto;

        return await this.unitOfWork.startTransaction<LessonEntity>( async ( ts ) => {

            const lessonResponse = await this.lessonRepository.createLesson(
                { 
                    ...rest,
                    lesson_number : lastLesson ? lastLesson.lesson_number+1 : 0,
                },
                ts 
            );

            const hasAdded = await this.moduleRepository.addLessonToModule( lessonResponse.id , module , ts );
            if( !hasAdded ) throw CustomError.internalServer('Hubo un error al intentar vincular la lección al modulo.');
            
            return lessonResponse;
        });
    }
    
}