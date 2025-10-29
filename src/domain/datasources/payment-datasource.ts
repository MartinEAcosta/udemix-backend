import { IdentificationTypesResponse, PaymentMethodsResponse, PaymentRequestAdapter } from "../dtos/payment/payment.response";

export abstract class PaymentDataSource {

    abstract createPayment( paymentRequestDto : any ) : Promise<any>;
    abstract findPaymentsMethods( ) : Promise<PaymentMethodsResponse[]>;
    abstract findIdentificationTypes( ) : Promise<IdentificationTypesResponse[]>;
    
}
