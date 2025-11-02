import { PaymentRepository } from "../../repository/payment-repository";

interface CheckStatusByIdUseCase {
    execute( action : string, id : number ) : Promise<any>;
}


export class CheckStatusById implements CheckStatusByIdUseCase {

    constructor (
        private readonly paymentRepository : PaymentRepository,
    ) {}


    async execute( action : string, id : number ) : Promise<any> {

        // const notifiaction = 

        throw new Error("Method not implemented.");
    }
}