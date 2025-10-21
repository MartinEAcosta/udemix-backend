import { PaymentMethodsResponse } from "../dtos/payment/payment.response";


export abstract class PaymentRepository {

    abstract createPayment( ) : Promise<any>;
    abstract findPaymentsMethods( ) : Promise<PaymentMethodsResponse[]>;
    
}