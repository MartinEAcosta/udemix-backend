import { PaymentCreatedResponseDto, PaymentMethodsResponse, IdentificationTypesResponse } from "../dtos/payment/payment.response";

export abstract class PaymentService {

    abstract createPayment( paymentRequestDto : any ) : Promise<PaymentCreatedResponseDto>;
    abstract findPaymentById( id : number ) : Promise<PaymentCreatedResponseDto>;
    abstract findPaymentsMethods() : Promise<PaymentMethodsResponse[]>;
    abstract findIdentificationTypes() : Promise<IdentificationTypesResponse[]>;

}
