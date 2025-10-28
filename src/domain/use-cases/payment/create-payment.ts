import { PaymentCreateDto } from "../../dtos/payment/payment-create.dto";
import { UserEntity } from "../../entities/user.entity";
import { CustomError } from "../../errors/custom-error";
import { AuthRepository, CourseRepository } from "../../repository";
import { PaymentRepository } from "../../repository/payment-repository";

interface CreatePaymentUseCase {
    execute( paymentRequestDto : PaymentCreateDto, user : UserEntity ) : Promise<any>;
}

export class CreatePayment implements CreatePaymentUseCase {

    constructor(
        private readonly paymentRepository : PaymentRepository,
        private readonly courseRepository  : CourseRepository,
        private readonly authRepository    : AuthRepository,
    ) { }

    async execute( paymentRequestDto : PaymentCreateDto, user : UserEntity ) : Promise<any> {
        console.log('b')
        const courses = await this.courseRepository.findCoursesByIds( paymentRequestDto.items );
        if( courses.length !== paymentRequestDto.items.length ) throw CustomError.badRequest('No puedes crear un pago con cursos inexistentes.');

        let totalAmount = 0;
        for( let course of courses){
            totalAmount += course.price;
        }
        console.log(totalAmount)
        console.log(paymentRequestDto)
        const userPayer = await this.authRepository.findUserById( user.id );
        if( !userPayer ) throw CustomError.badRequest('No puedes generar un pago sin un usuario vinculado.');
        const { items , ...rest } =paymentRequestDto;
        const paymentResponse = await this.paymentRepository.createPayment(
            {
                ...rest,
                transaction_amount : totalAmount,
                payer: {
                    email : user.email,
                },
                installments : 1,
            }
        );
        return paymentResponse;
    }

}