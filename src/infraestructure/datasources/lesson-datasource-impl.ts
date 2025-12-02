import { LessonDatasource } from '../../domain/datasources/lesson-datasource';
import { ILessonPopulateModel, LessonModel } from '../../data/mongo/models/lesson.model';
import { LessonMapper } from '../mappers/lesson.mapper';

import { CreateLessonDto } from '../../domain/dtos/lesson/create-lesson.dto';
import { LessonResponseDto, LessonResponsePopulateDto } from '../../domain/dtos/lesson/lesson.response.dto';
import { UpdateLessonDto } from '../../domain/dtos/lesson/update-lesson.dto';
import { TransactionSession } from '../../domain/services/UnitOfWork';

export class LessonDatasourceImpl implements LessonDatasource {

    async createLesson( lessonRequestDto : CreateLessonDto , ts ?: TransactionSession ) : Promise<LessonResponseDto> {
        const session = ts?.getSession();
        const lesson = await LessonModel.create([ {...lessonRequestDto} ] , { session } );

        return LessonMapper.fromLessonResponseDto( lesson[0] );
    }
    
    async updateLesson( lessonRequestDto : UpdateLessonDto) : Promise<LessonResponseDto> {
        const { id , ...rest } = lessonRequestDto;
        console.log(rest);
        const lessonUpdated = await LessonModel.findByIdAndUpdate(
                                                                {
                                                                    _id : id,
                                                                },
                                                                rest,
                                                                {
                                                                    new : true,
                                                                }
                                                                ).exec();
        
        return LessonMapper.fromLessonResponseDto( lessonUpdated! );
    }

    async deleteLesson( id : string ) : Promise<boolean> {
        const lessonDeleted = await LessonModel.findByIdAndDelete( { _id : id } );

        return lessonDeleted ? true : false;
    }

    async findAllLessonsByCourseId( id_course : string ) : Promise<LessonResponseDto[]> {
        const lessons = await LessonModel.find({ id_course : id_course })
                                            .sort({ lesson_number: 'asc'});
        
        return lessons.map( lesson => LessonMapper.fromLessonResponseDto( lesson ) );
    }

    async findAllLessonsPopulatedByCourseId( id_course : string ) : Promise<LessonResponsePopulateDto[]> {
        const lessons = await LessonModel.find({ id_course : id_course })
                                        .sort({ lesson_number: 'asc'})
                                        .populate<ILessonPopulateModel>('id_file', '_id url resource_type');
        return lessons.map( lesson => LessonMapper.fromLessonPopulateResponseDto( lesson ) );
    }
    
    async findLessonById( id : string ) : Promise<LessonResponseDto | null> {
        console.log('id' , id);
        const lesson = await LessonModel.findById({ _id : id});
        console.log(lesson);
        if( !lesson ) return null;

        return LessonMapper.fromLessonResponseDto( lesson );
    }

    async findLessonByLessonNumber( id_course : string , lesson_number : number ) : Promise<LessonResponsePopulateDto | null> {
        const lesson = await LessonModel.findOne({ id_course : id_course , lesson_number : lesson_number })
                                        .populate<ILessonPopulateModel>('id_file', '_id url resource_type extension');
        if( !lesson ) return null;

        return LessonMapper.fromLessonPopulateResponseDto( lesson );
    }

}