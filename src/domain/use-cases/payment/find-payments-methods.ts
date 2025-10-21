import { PaymentMethodsResponse } from "../../dtos/payment/payment.response";
import { CustomError } from "../../errors/custom-error";
import { PaymentRepository } from "../../repository/payment-repository";


interface FindPaymentsMethodsUseCase {
    execute( ) : Promise<PaymentMethodsResponse[]>;
}

export class FindPaymentsMethods implements FindPaymentsMethodsUseCase {

    constructor( 
        private readonly paymentRepository : PaymentRepository, 
    ){ }

    async execute() : Promise<PaymentMethodsResponse[]> {
        const paymentMethods = await this.paymentRepository.findPaymentsMethods();
        console.log(paymentMethods)
        if( !paymentMethods ) throw CustomError.internalServer('Hubo un error al recopilar los metodos de pago.');

        return paymentMethods;
    }

}