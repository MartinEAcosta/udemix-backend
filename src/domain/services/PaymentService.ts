import { IdentificationTypesResponse } from "../dtos/payment/payment.response";


export abstract class PaymentService {

    abstract createPayment( paymentRequestDto : any ) : Promise<any>;
    abstract findPaymentsMethods() : Promise<any>;
    abstract findIdentificationTypes() : Promise<any>;
    
}