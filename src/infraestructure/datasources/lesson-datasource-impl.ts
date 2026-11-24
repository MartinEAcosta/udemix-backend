import { LessonDatasource } from '../../domain/datasources/lesson-datasource';
import { ILessonPopulateModel, LessonModel } from '../../data/mongo/models/lesson.model';
import { LessonMapper } from '../mappers/lesson.mapper';

import { CreateLessonDto } from '../../domain/dtos/lesson/create-lesson.dto';
import { LessonResponseDto, LessonResponsePopulateDto } from '../../domain/dtos/lesson/lesson.response.dto';
import { UpdateLessonDto } from '../../domain/dtos/lesson/update-lesson.dto';
import { SetLessonFileDto } from '../../domain/dtos/lesson/set-lesson-file.dto';
import { TransactionSession } from '../../domain/services/UnitOfWork';
import { CustomError } from '../../domain/errors/custom-error';

export class LessonDatasourceImpl implements LessonDatasource {

    async createLesson( lessonRequestDto : CreateLessonDto , ts ?: TransactionSession ) : Promise<LessonResponseDto> {
        const session = ts?.getSession();
        const lesson = await LessonModel.create([ {...lessonRequestDto} ] , { session } );

        return LessonMapper.fromLessonResponseDto( lesson[0] );
    }
    
    async updateLesson( lessonRequestDto : UpdateLessonDto) : Promise<LessonResponseDto> {
        if( !( lessonRequestDto instanceof UpdateLessonDto ) ) {
            throw CustomError.internalServer('updateLesson exige un UpdateLessonDto construido por sus factories.');
        }

        const { id , ...fieldsToUpdate } = lessonRequestDto;

        const lessonUpdated = await LessonModel.findByIdAndUpdate(
                                                                id,
                                                                { $set : fieldsToUpdate },
                                                                { new : true },
                                                                ).exec();
        if( !lessonUpdated ) throw CustomError.notFound('La lección que intentas actualizar no existe.');

        return LessonMapper.fromLessonResponseDto( lessonUpdated );
    }

    /** Único camino para escribir el id_file de una lección: lo setea el archivo recién subido. */
    async setLessonFile( fileDto : SetLessonFileDto ) : Promise<LessonResponseDto> {
        if( !( fileDto instanceof SetLessonFileDto ) ) {
            throw CustomError.internalServer('setLessonFile exige un SetLessonFileDto construido por su factory.');
        }

        const lessonUpdated = await LessonModel.findByIdAndUpdate(
                                                                fileDto.id_lesson,
                                                                { $set : { id_file : fileDto.id_file } },
                                                                { new : true },
                                                                ).exec();
        if( !lessonUpdated ) throw CustomError.notFound('La lección a la que intentas asignar el archivo no existe.');

        return LessonMapper.fromLessonResponseDto( lessonUpdated );
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
        const lesson = await LessonModel.findById({ _id : id});
        if( !lesson ) return null;

        return LessonMapper.fromLessonResponseDto( lesson );
    }

    async findLessonPopulatedById( id : string ) : Promise<LessonResponsePopulateDto | null> {
        const lesson = await LessonModel.findById({ _id : id})
                                        .populate<ILessonPopulateModel>('id_file', '_id url resource_type extension');
        if( !lesson ) return null;

        return LessonMapper.fromLessonPopulateResponseDto( lesson );
    }

    async findLessonByLessonNumber( id_course : string , lesson_number : number ) : Promise<LessonResponsePopulateDto | null> {
        const lesson = await LessonModel.findOne({ id_course : id_course , lesson_number : lesson_number })
                                        .populate<ILessonPopulateModel>('id_file', '_id url resource_type extension');
        if( !lesson ) return null;

        return LessonMapper.fromLessonPopulateResponseDto( lesson );
    }

}