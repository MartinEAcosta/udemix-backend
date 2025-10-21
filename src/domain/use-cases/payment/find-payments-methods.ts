import { CustomError } from "../../errors/custom-error";
import { PaymentRepository } from "../../repository/payment-repository";


interface FindPaymentsMethodsUseCase {
    execute( ) : Promise<any>;
}

export class FindPaymentsMethods implements FindPaymentsMethodsUseCase {

    constructor( 
        private readonly paymentRepository : PaymentRepository, 
    ){ }

    async execute() : Promise<any> {

        const paymentMethods = await this.paymentRepository.findPaymentsMethods();
        if( paymentMethods ) throw CustomError.internalServer('Hubo un error al recopilar los metodos de pago.');

        return paymentMethods;
    }

}