import { CourseResponseDto } from './../../domain/dtos/course/course.responses';
import { ICourseModel } from "../../data"


export class CourseMapper {

    static fromCourseDto = ( courseDoc : ICourseModel ) : CourseResponseDto => {
        return {
            id : courseDoc._id.toString(),
            title : courseDoc.title,
            description : courseDoc.description,
            category : courseDoc.category ?? null,
            thumbnail_url : courseDoc.thumbnail_url,
            thumbnail_id : courseDoc.thumbnail_id.toString(),
            id_owner : courseDoc.id_owner.toString(),
            price : courseDoc.price,
            capacity : courseDoc.capacity ?? undefined,
        }
    } 
}