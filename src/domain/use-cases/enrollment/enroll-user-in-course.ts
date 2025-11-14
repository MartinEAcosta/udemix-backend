import { EnrollmentRepository } from "../../repository/enrollment-repository";
import { EnrollmentEntity } from "../../entities/enrollment.entity";

import { CreateEnrollmentDto } from "../../dtos/enrollment/create-enrollment.dto";
import { CustomError } from "../../errors/custom-error";
import { AuthRepository } from "../../repository/auth-repository";
import { CourseRepository } from "../../repository/course-repository";
import { UnitOfWork } from '../../services/UnitOfWork';

export interface EnrollUserInCourseUseCase {
    execute( enrollmentDto : CreateEnrollmentDto ) : Promise<EnrollmentEntity>;
}

export class EnrollUserInCourse implements EnrollUserInCourseUseCase {

    constructor( 
        private readonly enrollmentRepository : EnrollmentRepository,
        private readonly authRepository       : AuthRepository,
        private readonly courseRepository     : CourseRepository,
        private readonly unitOfWork           : UnitOfWork,
    ) { }

    execute = async( enrollmentDto : CreateEnrollmentDto ) : Promise<EnrollmentEntity> => {
        
        const user = await this.authRepository.findUserById( enrollmentDto.id_user ); 
        if( !user ) throw CustomError.notFound("El usuario que estas intentando buscar no existe.");

        const course = await this.courseRepository.findCourseById( enrollmentDto.id_course ); 
        if( !course ) throw CustomError.notFound("El curso que estas intentando buscar no existe.");

        const alreadyEnrolled = await this.enrollmentRepository.findEnrollmentByUserIdAndCourseId( enrollmentDto.id_user , enrollmentDto.id_course );
        if( alreadyEnrolled ) throw CustomError.badRequest("El usuario ya se encuentra inscripto en este curso.");

        if( user.balance < course.price ) throw CustomError.badRequest("El usuario no tiene el saldo suficiente para adquirir el curso");

        let enrollmentCreated : EnrollmentEntity | null = null;

        await this.unitOfWork.startTransaction<EnrollmentEntity>( async ( ts ) => {
                user.balance -= course.price;
                enrollmentCreated = await this.enrollmentRepository.saveEnrollment( enrollmentDto , ts );
                if( !enrollmentCreated ) throw CustomError.internalServer('Hubo un error al crear la inscripción del curso.');
                
                const updatedUser = await this.authRepository.updateUser( {...user} , ts );
                if( !updatedUser ) throw CustomError.internalServer('Hubo un error al actualizar el usuario con el curso adquirido.');
                
                
            return enrollmentCreated;
        });

        if( !enrollmentCreated ) throw CustomError.internalServer('Hubo un error inesperado.');

        return enrollmentCreated;
    }
    
    
}