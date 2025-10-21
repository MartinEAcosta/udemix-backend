

export abstract class PaymentService {

    abstract createPayment() : Promise<any>;
    abstract findPaymentsMethods() : Promise<any>;
    
}