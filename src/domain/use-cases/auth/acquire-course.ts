import { CustomError } from "../../errors/custom-error";
import { AuthRepository } from "../../repository/auth-repository";
import { CourseRepository } from "../../repository/course-repository";
import { UserResponseDto } from '../../dtos/auth/auth.responses.dto';

interface AcquireCourseUseCase {
    execute( user_id : string , course_id : string ) : Promise<UserResponseDto>;
}

export class AcquireCourse implements AcquireCourseUseCase {

    constructor(
        private readonly authRepository : AuthRepository,
        private readonly courseRepository : CourseRepository,
    ) { }

    execute = async( user_id: string, course_id: string) : Promise<UserResponseDto> => {

        const user = await this.authRepository.findUserById( user_id ); 
        if( !user ) throw CustomError.notFound("El usuario que estas intentando buscar no existe.");
        
        const course = await this.courseRepository.findCourseById( course_id ); 
        if( !course ) throw CustomError.notFound("El curso que estas intentando buscar no existe.");

        const alreadyAcquired = user.enrolledCourses.some( enrolledCourseId => enrolledCourseId.toString() === course_id );
        if( alreadyAcquired ) throw CustomError.badRequest("El usuario ya se encuentra inscripto en este curso.");

        if( user.balance <= course.price ) throw CustomError.badRequest("El usuario no tiene el saldo suficiente para adquirir el curso");

        user.balance -= course.price;
        user.enrolledCourses?.push( course_id );

        const updatedUser = await this.authRepository.acquireCourse( user , user.id! );
        if( !updatedUser ) throw CustomError.internalServer('Hubo un error al actualizar el usuario con el curso adquirido.');
        const { password , ...userWithoutPass } = updatedUser;
        
        return {
            ...userWithoutPass,
        };
    }

}