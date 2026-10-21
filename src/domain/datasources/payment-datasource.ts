import { PaymentCreateDto } from "../dtos/payment/payment-create.dto";
import { PaymentRequestAdapterDto } from "../dtos/payment/payment-request-adapter.dto";
import { PaymentUpdateDto } from "../dtos/payment/payment-update.dto";
import { IdentificationTypesResponse, PaymentGatewayResult, PaymentMethodsResponse, PaymentResponseDto } from "../dtos/payment/payment.response";

export abstract class PaymentDataSource {

    abstract startPayment( paymentRequest : PaymentRequestAdapterDto ) : Promise<PaymentGatewayResult | null>;
    abstract createPayment( paymentRequest : PaymentCreateDto ) : Promise<PaymentResponseDto>;
    abstract updatePayment( paymentRequest : PaymentUpdateDto ) : Promise<PaymentResponseDto>;
    abstract updatePaymentByIdPayment( paymentRequest : PaymentUpdateDto ) : Promise<PaymentResponseDto>;
    abstract findPaymentById( id : number ) : Promise<PaymentGatewayResult>;
    abstract findPaymentsMethods( ) : Promise<PaymentMethodsResponse[]>;
    abstract findIdentificationTypes( ) : Promise<IdentificationTypesResponse[]>;
    
}
