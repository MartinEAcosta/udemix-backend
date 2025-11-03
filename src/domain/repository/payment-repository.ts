import { PaymentCreateDto } from "../dtos/payment/payment-create.dto";
import { PaymentRequestAdapterDto } from "../dtos/payment/payment-request-adapter.dto";
import { IdentificationTypesResponse, PaymentMethodsResponse, PaymentResponse } from "../dtos/payment/payment.response";
import { PaymentEntity } from "../entities/payment.entity";

export abstract class PaymentRepository {

    abstract startPayment( paymentRequest : PaymentRequestAdapterDto ) : Promise<PaymentResponse | null>;
    abstract createPayment( paymentRequest : PaymentCreateDto ) : Promise<PaymentEntity>;
    abstract updatePayment( paymentRequest : any ) : Promise<PaymentEntity>
    abstract findPaymentById( id : number ) : Promise<any>;
    abstract findPaymentsMethods( ) : Promise<PaymentMethodsResponse[]>;
    abstract findIdentificationTypes( ) : Promise<IdentificationTypesResponse[]>;
    
}