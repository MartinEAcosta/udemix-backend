import { PaymentCreateDto } from "../../dtos/payment/payment-create.dto";
import { UserEntity } from "../../entities/user.entity";
import { CustomError } from "../../errors/custom-error";
import { AuthRepository, CourseRepository } from "../../repository";
import { PaymentRepository } from "../../repository/payment-repository";
import { CalculateTotal } from "./calculate-total";

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

        const total = await new CalculateTotal( this.courseRepository )
                            .execute( paymentRequestDto.items , paymentRequestDto.code )
        if( !total ) throw CustomError.internalServer('Hubo un error en el calculo de el total.')

        const userPayer = await this.authRepository.findUserById( user.id );
        if( !userPayer ) throw CustomError.badRequest('No puedes generar un pago sin un usuario vinculado.');
        const { items , ...rest } =paymentRequestDto;
        const paymentResponse = await this.paymentRepository.createPayment(
            {
                ...rest,
                transaction_amount : total,
            }
        );
        return paymentResponse;
    }

}