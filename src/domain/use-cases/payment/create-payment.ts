import { PaymentCreateDto } from "../../dtos/payment/payment-create.dto";
import { CustomError } from "../../errors/custom-error";
import { AuthRepository, CourseRepository } from "../../repository";
import { PaymentRepository } from "../../repository/payment-repository";

interface CreatePaymentUseCase {
    execute( paymentRequestDto : PaymentCreateDto ) : Promise<any>;
}

export class CreatePayment implements CreatePaymentUseCase {

    constructor(
        private readonly paymentRepository : PaymentRepository,
        private readonly courseRepository  : CourseRepository,
        private readonly authRepository    : AuthRepository,
    ) { }

    async execute( paymentRequestDto : PaymentCreateDto ) : Promise<any> {

        const courses = await this.courseRepository.findCoursesByIds( paymentRequestDto.items );
        if( courses.length !== paymentRequestDto.items.length ) throw CustomError.badRequest('No puedes crear un pago con cursos inexistentes.');

        let totalAmount = 0;
        for( let course of courses){
            totalAmount += course.price;
        }

        const userPayer = await this.authRepository.findUserById( paymentRequestDto.user_id );
        if( !userPayer ) throw CustomError.badRequest('No puedes generar un pago sin un usuario vinculado.');

        const paymentResponse = await this.paymentRepository.createPayment(
            {
                transaction_amount : totalAmount,
                ...paymentRequestDto,
            }
        );
    }

}