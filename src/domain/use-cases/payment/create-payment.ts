import { CustomError } from "../../errors/custom-error";
import { AuthRepository, CourseRepository } from "../../repository";
import { PaymentRepository } from "../../repository/payment-repository";

interface CreatePaymentUseCase {
    execute( id_courses : string[] , id_user : string ) : Promise<any>;
}

export class CreatePayment implements CreatePaymentUseCase {

    constructor(
        private readonly paymentRepository : PaymentRepository,
        private readonly courseRepository  : CourseRepository,
        private readonly authRepository    : AuthRepository,
    ) { }

    async execute( id_courses : string[] , id_user : string ) : Promise<any> {

        const courses = await this.courseRepository.findCoursesByIds( id_courses );
        if( courses.length !== id_courses.length ) throw CustomError.badRequest('No puedes crear un pago con cursos inexistentes.');

        let totalAmount = 0;
        for( let course of courses){
            totalAmount += course.price;
        }

        const userPayer = await this.authRepository.findUserById( id_user );
        if( !userPayer ) throw CustomError.badRequest('No puedes generar un pago sin un usuario vinculado.');



        
        
        
    }

}