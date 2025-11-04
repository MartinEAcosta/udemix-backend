import { PaymentCreateDto } from "../dtos/payment/payment-create.dto";
import { PaymentRequestAdapterDto } from "../dtos/payment/payment-request-adapter.dto";
import { PaymentUpdateDto } from "../dtos/payment/payment-update.dto";
import { IdentificationTypesResponse, PaymentCreatedResponseDto, PaymentMethodsResponse } from "../dtos/payment/payment.response";
import { PaymentEntity } from "../entities/payment.entity";

export abstract class PaymentRepository {

    abstract startPayment( paymentRequest : PaymentRequestAdapterDto ) : Promise<PaymentCreatedResponseDto | null>;
    abstract createPayment( paymentRequest : PaymentCreateDto ) : Promise<PaymentEntity>;
    abstract updatePayment( paymentRequest : PaymentUpdateDto ) : Promise<PaymentEntity>
    abstract updatePaymentByIdPayment( paymentRequest : PaymentUpdateDto ) : Promise<PaymentEntity>
    abstract findPaymentById( id : number ) : Promise<any>;
    abstract findPaymentsMethods( ) : Promise<PaymentMethodsResponse[]>;
    abstract findIdentificationTypes( ) : Promise<IdentificationTypesResponse[]>;
    
}