import { PaymentRepository } from "../../repository/payment-repository";

interface CheckStatusByIdUseCase {
    execute( action : string, id : number ) : Promise<any>;
}


export class CheckStatusById implements CheckStatusByIdUseCase {

    constructor (
        private readonly paymentRepository : PaymentRepository,
    ) {}


    async execute( action : string, id : number ) : Promise<any> {

        const notification = await this.paymentRepository.findPaymentById( id );
        console.log( notification )

        return notification;
    }
}