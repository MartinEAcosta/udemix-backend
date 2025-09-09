import { ILessonModel } from "../../data/mongo/models/lesson.model";

export class LessonMapper {

    static fromLessonResponseDto( lessonDoc : ILessonModel ) : LessonResponseDto {
        return {
            id            : lessonDoc._id.toString(),
            id_course     : lessonDoc.id_course.toString(),
            title         : lessonDoc.title,
            description   : lessonDoc.description,
         id_file: lessonDoc.id_file ? lessonDoc.id_file.toString() : undefined,
      unit: lessonDoc.unit ?? undefined,
      chapter: lessonDoc.chapter ?? undefined,
            lesson_number : lessonDoc.lesson_number,
            uploaded_at   : lessonDoc.uploaded_at,
        }
    }
}