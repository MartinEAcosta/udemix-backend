import { LessonDatasource } from '../../domain/datasources/lesson-datasource';
import { CreateLessonDto } from '../../domain/dtos/lesson/create-lesson.dto';
import { LessonResponsePopulateDto } from '../../domain/dtos/lesson/lesson.response.dto';
import { UpdateLessonDto } from '../../domain/dtos/lesson/update-lesson.dto';
import { LessonEntity } from '../../domain/entities/lesson.entity';
import { LessonRepository } from '../../domain/repository/lesson-repository';
import { TransactionSession } from '../../domain/services/UnitOfWork';


export class LessonRepositoryImpl implements LessonRepository {

    constructor( 
        private readonly lessonDatasource : LessonDatasource,
    ) { }

    async createLesson( lessonRequestDto : CreateLessonDto , ts ?: TransactionSession ) : Promise<LessonEntity> {
        try{
            const createdLesson = await this.lessonDatasource.createLesson( lessonRequestDto , ts );
            
            return LessonEntity.fromObject( createdLesson );
        } 
        catch( error ){
            throw error;
        }
    }
    
    async updateLesson( lessonRequestDto : UpdateLessonDto ) : Promise<LessonEntity> {
        try{
            const updatedLesson = await this.lessonDatasource.updateLesson( lessonRequestDto );

            return LessonEntity.fromObject( updatedLesson );
        } 
        catch( error ){
            throw error;
        }
    }
    
    async deleteLesson( id : string ) : Promise<boolean> {
        try{
            const hasDeleted = await this.lessonDatasource.deleteLesson( id );
            
            return hasDeleted;
        }
        catch( error ){
            throw error;
        }
    }
    
    async findAllLessonsByCourseId( course_id : string ) : Promise<LessonEntity[]> {
        try{
            const lessons = await this.lessonDatasource.findAllLessonsByCourseId( course_id );
            
            return lessons.map( lesson => LessonEntity.fromObject( lesson ) );
        }
        catch( error ){
            throw error;
        }
    }

    async findAllLessonsPopulatedByCourseId( course_id : string ) : Promise<LessonResponsePopulateDto[]> {
        try{
            const lessons = await this.lessonDatasource.findAllLessonsPopulatedByCourseId( course_id );
            
            return lessons;
        }
        catch( error ){
            throw error;
        }
    }
    
    async findLessonById( id : string ) : Promise<LessonEntity | null> {
        try{
            const lesson = await this.lessonDatasource.findLessonById( id );
            if( !lesson ) return null;

            return LessonEntity.fromObject( lesson );
        }
        catch( error ){
            throw error;
        }
    }

    async findLessonByLessonNumber ( id_course : string , lesson_number : number ) : Promise<LessonResponsePopulateDto | null> {
        try{
            const lesson = await this.lessonDatasource.findLessonByLessonNumber( id_course , lesson_number );
            return lesson ? lesson : null;
        }
        catch( error ){
            throw error;
        }
    }

}