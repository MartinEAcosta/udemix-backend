import { LessonDatasource } from '../../domain/datasources/lesson.datasource';
import { CreateLessonDto } from '../../domain/dtos/lesson/create-lesson.dto';
import { LessonEntity } from '../../domain/entities/lesson.entity';
import { LessonRepository } from '../../domain/repository/lesson-repository';


export class LessonRepositoryImpl implements LessonRepository {

    constructor( 
        private readonly lessonDatasource : LessonDatasource,
    ) { }

    async createLesson( lessonRequestDto : CreateLessonDto ) : Promise<LessonEntity> {
        try{
            const createdLesson = await this.lessonDatasource.createLesson( lessonRequestDto );

            return LessonEntity.fromObject( createdLesson );
        } 
        catch( error ){
            throw error;
        }
    }

    async findAllLessonsByCourseId( course_id : string ) : Promise<LessonEntity[]> {
        try{
            const lessons = await this.lessonDatasource.findAllLessonByCourseId( course_id );
            
            return lessons.map( lesson => LessonEntity.fromObject( lesson ) );
        }
        catch( error ){
            throw error;
        }
    }

    
}