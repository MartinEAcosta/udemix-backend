import { CourseResponseDto } from './../../domain/dtos/course/course.responses';
import { ICourseModel } from "../../data"


export class CourseMapper {

    static fromCourseDto = ( courseDoc : ICourseModel ) : CourseResponseDto => {
        return {
            id : courseDoc._id.toString(),
            title : courseDoc.title,
            description : courseDoc.description,
            category : courseDoc.category ?? " ",
            thumbnail_url : courseDoc.thumbnail_url ?? null,
            thumbnail_id : courseDoc.thumbnail_id?.toString() ?? null,
            id_owner : courseDoc.id_owner.toString(),
            price : courseDoc.price,
            capacity : courseDoc.capacity ?? undefined,
        }
    } 
}