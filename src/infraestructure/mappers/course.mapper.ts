import { ICourseModel, ICourseWithOwnerModel } from '../../data';
import { CourseEntity } from '../../domain/entities/course.entity';
import { CourseResponseDto, CourseWithOwnerResponseDto } from './../../domain/dtos/course/course.responses';

export class CourseMapper { 

    static fromCourseResponseDto = ( courseDoc : ICourseModel ) : CourseResponseDto => {
        return {
            id : courseDoc._id.toString(),
            title : courseDoc.title,
            description : courseDoc.description,
            id_category : courseDoc.id_category?.toString() ?? null,
            category_name : courseDoc.category_name ?? null,
            thumbnail_url : courseDoc.thumbnail_url ?? null,
            id_file : courseDoc.id_file?.toString() ?? null,
            id_owner : courseDoc.id_owner.toString(),
            price : courseDoc.price,
            capacity : courseDoc.capacity ?? undefined,
            current_enrolled : courseDoc.current_enrolled,
            spots_remaining : CourseEntity.calculateSpotsRemaining( courseDoc.capacity , courseDoc.current_enrolled ),
        }
    }

    static fromCourseWithOwnerResponseDto = ( courseDoc : ICourseWithOwnerModel ) : CourseWithOwnerResponseDto => {
        const owner = courseDoc.owner;
        return {
            ...CourseMapper.fromCourseResponseDto( courseDoc ),
            owner : owner
                ? {
                    id : owner._id.toString(),
                    first_name : owner.first_name,
                    last_name : owner.last_name,
                    // Leído directo del usuario: ya no se deriva del File vía id_file poblado.
                    avatar_url : owner.avatar_url ?? null,
                }
                : null,
        }
    }
}
