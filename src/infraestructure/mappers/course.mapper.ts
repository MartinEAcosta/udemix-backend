import { ICourseModel, ICoursePopulateOwnerModel } from '../../data';
import { CourseEntity } from '../../domain/entities/course.entity';
import { CoursePopulateOwnerResponseDto, CourseResponseDto } from './../../domain/dtos/course/course.responses';

/** Curso poblado cuyo owner ya fue verificado como existente. */
type CourseWithOwner = Omit<ICoursePopulateOwnerModel , 'id_owner'> & {
    id_owner : NonNullable<ICoursePopulateOwnerModel['id_owner']>,
};


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

    static fromCoursePopulateOwnerResponseDto = ( courseDoc : CourseWithOwner ) : CoursePopulateOwnerResponseDto => {
        const owner = courseDoc.id_owner;
        return {
            id : courseDoc._id.toString(),
            title : courseDoc.title,
            description : courseDoc.description,
            id_category : courseDoc.id_category?.toString() ?? null,
            category_name : courseDoc.category_name ?? null,
            thumbnail_url : courseDoc.thumbnail_url ?? null,
            id_file : courseDoc.id_file?.toString() ?? null,
            owner : {
                id : owner._id.toString(),
                username : owner.username,
                email : owner.email,
                avatar_url : owner.avatar_url,
            },
            price : courseDoc.price,
            capacity : courseDoc.capacity ?? undefined,
            current_enrolled : courseDoc.current_enrolled,
            spots_remaining : CourseEntity.calculateSpotsRemaining( courseDoc.capacity , courseDoc.current_enrolled ),
        }
    }
}
