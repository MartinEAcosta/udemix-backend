import { PaymentMethodsResponse, PaymentRequestAdapter } from "../dtos/payment/payment.response";


export abstract class PaymentRepository {

    abstract createPayment( paymentRequest : PaymentRequestAdapter ) : Promise<any>;
    abstract findPaymentsMethods( ) : Promise<PaymentMethodsResponse[]>;
    
}