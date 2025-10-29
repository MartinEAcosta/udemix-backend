import { IdentificationTypesResponse, PaymentMethodsResponse, PaymentRequestAdapter } from "../dtos/payment/payment.response";


export abstract class PaymentRepository {

    abstract createPayment( paymentRequest : any ) : Promise<any>;
    abstract findPaymentsMethods( ) : Promise<PaymentMethodsResponse[]>;
    abstract findIdentificationTypes( ) : Promise<IdentificationTypesResponse[]>;
    
}