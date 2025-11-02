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

        const userLogged = await this.authRepository.findUserById( user.id );
        if( !userLogged ) throw CustomError.badRequest('No puedes generar un pago sin un usuario vinculado.');
        const paymentResponse : PaymentCreateDto = await this.paymentRepository.createPayment(
            {
                ...paymentRequestDto,
                transaction_amount : total,
            },
            userLogged,
        );
        return paymentResponse;
    }

}