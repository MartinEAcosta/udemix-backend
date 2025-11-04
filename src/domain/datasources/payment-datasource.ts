import { PaymentCreateDto } from "../dtos/payment/payment-create.dto";
import { PaymentRequestAdapterDto } from "../dtos/payment/payment-request-adapter.dto";
import { PaymentUpdateDto } from "../dtos/payment/payment-update.dto";
import { IdentificationTypesResponse, PaymentCreatedResponseDto, PaymentMethodsResponse, PaymentResponseDto } from "../dtos/payment/payment.response";
import { PaymentEntity } from "../entities/payment.entity";
import { UserEntity } from "../entities/user.entity";

export abstract class PaymentDataSource {

    abstract startPayment( paymentRequest : PaymentRequestAdapterDto ) : Promise<PaymentCreatedResponseDto | null>;
    abstract createPayment( paymentRequest : PaymentCreateDto ) : Promise<PaymentResponseDto>;
    abstract updatePayment( paymentRequest : PaymentUpdateDto ) : Promise<PaymentResponseDto>;
    abstract updatePaymentByIdPayment( paymentRequest : PaymentUpdateDto ) : Promise<PaymentResponseDto>;
    abstract findPaymentById( id : number ) : Promise<any>;
    abstract findPaymentsMethods( ) : Promise<PaymentMethodsResponse[]>;
    abstract findIdentificationTypes( ) : Promise<IdentificationTypesResponse[]>;
    
}
