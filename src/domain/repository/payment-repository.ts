import { PaymentMethodsResponse } from "../dtos/payment/payment.response";


export abstract class PaymentRepository {

    abstract createPayment( paymentRequestDto : any ) : Promise<any>;
    abstract findPaymentsMethods( ) : Promise<PaymentMethodsResponse[]>;
    
}