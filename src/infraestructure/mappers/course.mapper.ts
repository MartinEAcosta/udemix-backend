import { ICourseModel } from '../../data';
import { CourseResponseDto } from './../../domain/dtos/course/course.responses';


export class CourseMapper {

    static fromCourseResponseDto = ( courseDoc : ICourseModel ) : CourseResponseDto => {
        return {
            id : courseDoc._id.toString(),
            title : courseDoc.title,
            description : courseDoc.description,
            id_category : courseDoc.id_category?.toString() ?? null,
            thumbnail_url : courseDoc.thumbnail_url ?? null,
            file_id : courseDoc.file_id?.toString() ?? null,
            id_owner : courseDoc.id_owner.toString(),
            price : courseDoc.price,
            capacity : courseDoc.capacity ?? undefined,
            current_enrolled : courseDoc.current_enrolled,
        }
    } 
}