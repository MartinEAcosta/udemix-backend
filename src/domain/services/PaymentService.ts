import { PaymentRequestAdapterDto } from "../dtos/payment/payment-request-adapter.dto";
import { PaymentGatewayResult, PaymentMethodsResponse, IdentificationTypesResponse } from "../dtos/payment/payment.response";

export abstract class PaymentService {

    abstract createPayment( paymentRequestDto : PaymentRequestAdapterDto ) : Promise<PaymentGatewayResult>;
    abstract findPaymentById( id : number ) : Promise<PaymentGatewayResult>;
    abstract findPaymentsMethods() : Promise<PaymentMethodsResponse[]>;
    abstract findIdentificationTypes() : Promise<IdentificationTypesResponse[]>;

}
