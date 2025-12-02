import { ILessonModel, ILessonPopulateModel } from "../../data/mongo/models/lesson.model";
import { LessonResponseDto, LessonResponsePopulateDto } from "../../domain/dtos/lesson/lesson.response.dto";

export class LessonMapper {

    static fromLessonResponseDto( lessonDoc : ILessonModel ) : LessonResponseDto {
        return {
            id            : lessonDoc._id.toString(),
            id_course     : lessonDoc.id_course.toString(),
            id_file       : lessonDoc.id_file ? lessonDoc.id_file.toString() : undefined,
            id_module     : lessonDoc.id_module.toString(),
            title         : lessonDoc.title,
            description   : lessonDoc.description,
            // unit          : lessonDoc.unit ?? undefined,
            // chapter       : lessonDoc.chapter ?? undefined,
            lesson_number : lessonDoc.lesson_number,
            uploaded_at   : lessonDoc.uploaded_at,
        }
    }

    static fromLessonPopulateResponseDto( lessonDoc : ILessonPopulateModel ) : LessonResponsePopulateDto {
        return {
            id            : lessonDoc._id.toString(),
            id_course     : lessonDoc.id_course.toString(),
            file: lessonDoc.id_file
            ? {
                id: lessonDoc.id_file.id ? lessonDoc.id_file.id.toString() : null,
                url: lessonDoc.id_file.url,
                resource_type: lessonDoc.id_file.resource_type,
                extension : lessonDoc.id_file.extension,
            }
            : { id: null, url: null , resource_type : 'image' , extension : null },
            id_module     : lessonDoc.id_module.toString(),
            title         : lessonDoc.title,
            description   : lessonDoc.description,
            lesson_number : lessonDoc.lesson_number,
            uploaded_at   : lessonDoc.uploaded_at,
        }
    }
}