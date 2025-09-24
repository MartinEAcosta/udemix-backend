import { LessonDatasource } from '../../domain/datasources/lesson.datasource';
import { LessonModel } from '../../data/mongo/models/lesson.model';
import { LessonMapper } from '../mappers/lesson.mapper';

import { CreateLessonDto } from '../../domain/dtos/lesson/create-lesson.dto';
import { LessonResponseDto } from '../../domain/dtos/lesson/lesson.response.dto';

export class LessonDatasourceImpl implements LessonDatasource {


    async createLesson( lessonRequestDto : CreateLessonDto ) : Promise<LessonResponseDto> {
        const lesson = await LessonModel.create( lessonRequestDto );

        return LessonMapper.fromLessonResponseDto( lesson );
    }

    async deleteLesson( id : string ) : Promise<boolean> {
        const lessonDeleted = await LessonModel.findByIdAndDelete( { _id : id } );

        return lessonDeleted ? true : false;
    }

    async findAllLessonByCourseId( course_id : string ) : Promise<LessonResponseDto[]> {
        const lessons = await LessonModel.find({ id_course : course_id }).sort({ lesson_number: 'asc'});
        
        return lessons.map( lesson => LessonMapper.fromLessonResponseDto( lesson ) );
    }
    
    async findLessonById( id : string ) : Promise<LessonResponseDto | null> {
        const lesson = await LessonModel.findById( id );
        if( !lesson ) return null;

        return LessonMapper.fromLessonResponseDto( lesson );
    }
}