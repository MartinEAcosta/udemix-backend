import { LessonModel } from '../../data/mongo/models/lesson.model';
import { LessonDatasource } from '../../domain/datasources/lesson.datasource';
import { CreateLessonDto } from '../../domain/dtos/lesson/create-lesson.dto';
import { LessonMapper } from '../mappers/lesson.mapper';

export class LessonDatasourceImpl implements LessonDatasource {


    async createLesson( lessonRequestDto : CreateLessonDto ) : Promise<LessonResponseDto> {
        const lesson = await LessonModel.create( lessonRequestDto );

        return LessonMapper.fromLessonResponseDto( lesson );
    }

    async findAllLessonByCourseId( course_id : string ) : Promise<LessonResponseDto[]> {
        const lessons = await LessonModel.find({ course_id : course_id });

        return lessons.map( lesson => LessonMapper.fromLessonResponseDto( lesson ) );
    }
    
}