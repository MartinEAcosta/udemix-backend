import { CustomError } from "../../errors/custom-error";
import { PaymentRepository } from "../../repository/payment-repository";

interface CheckStatusByIdUseCase {
    execute( id : number ) : Promise<any>;
}


export class CheckStatusById implements CheckStatusByIdUseCase {

    constructor (
        private readonly paymentRepository : PaymentRepository,
    ) {}


    async execute( id : number ) : Promise<any> {

        if( !id ) throw CustomError.badRequest('Es necesario indicar el id del pago.');

        const notification = await this.paymentRepository.findPaymentById( id );
        const { status } = notification;

        const updatedPayment = await this.paymentRepository.updatePaymentByIdPayment(
            {
                id_payment : id, 
                status : status
            });
        console.log(updatedPayment);
        return updatedPayment;
    }
}