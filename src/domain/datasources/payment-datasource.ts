import { PaymentRequestDTO } from "../dtos/payment/payment-request.dto";
import { PaymentUpdateDto } from "../dtos/payment/payment-update.dto";
import { IdentificationTypesResponse, PaymentMethodsResponse, PaymentResponseDto } from "../dtos/payment/payment.response";

export abstract class PaymentDataSource {

    abstract createPayment( paymentRequestDTO : PaymentRequestDTO ) : Promise<PaymentResponseDto>;
    abstract updatePayment( paymentRequest : PaymentUpdateDto ) : Promise<PaymentResponseDto>;
    abstract updatePaymentByIdPayment( paymentRequest : PaymentUpdateDto ) : Promise<PaymentResponseDto>;
    abstract findPaymentsMethods( ) : Promise<PaymentMethodsResponse[]>;
    abstract findIdentificationTypes( ) : Promise<IdentificationTypesResponse[]>;
    
}
