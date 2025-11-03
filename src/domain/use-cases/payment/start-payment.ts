import { PaymentRequestAdapterDto } from "../../dtos/payment/payment-request-adapter.dto";
import { UserEntity } from "../../entities/user.entity";
import { CustomError } from "../../errors/custom-error";
import { AuthRepository, CourseRepository } from "../../repository";
import { PaymentRepository } from "../../repository/payment-repository";
import { CalculateTotal } from "./calculate-total";

interface StartPaymentUseCase {
    execute( paymentRequestDto : PaymentRequestAdapterDto , user : UserEntity ) : Promise<any>;
}

export class StartPayment implements StartPaymentUseCase {

    constructor(
        private readonly paymentRepository : PaymentRepository,
        private readonly courseRepository  : CourseRepository,
        private readonly authRepository    : AuthRepository,
    ) { }

    async execute( paymentRequestDto : PaymentRequestAdapterDto , user : UserEntity ) : Promise<any> {

        const total = await new CalculateTotal( this.courseRepository )
                            .execute( paymentRequestDto.items , paymentRequestDto.code )
        if( !total ) throw CustomError.internalServer('Hubo un error en el calculo de el total.')

        const userLogged = await this.authRepository.findUserById( user.id );
        if( !userLogged ) throw CustomError.badRequest('No puedes generar un pago sin un usuario vinculado.');
        
        const paymentResponse = await this.paymentRepository.startPayment(
            {
                ...paymentRequestDto,
                transaction_amount : total,
            },
        );
        
        if( !paymentResponse ) throw CustomError.internalServer('Ocurrió un error inesperado y no se pudo iniciar el pago.');
        const paymentCreated = await this.paymentRepository.createPayment(
            {
                id_user : userLogged.id,
                id_courses : paymentRequestDto.items.map( item => item.id_course ),
                id_payment : paymentResponse.id,
                amount : total,
                date : new Date(),
                method : 'card',
                status : paymentResponse.status
            }
        );

        return paymentCreated;
    }

}