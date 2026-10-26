import { PaymentRequestDTO } from "../dtos/payment/payment-request.dto";
import { PaymentUpdateDto } from "../dtos/payment/payment-update.dto";
import { IdentificationTypesResponse, PaymentMethodsResponse } from "../dtos/payment/payment.response";
import { PaymentEntity } from "../entities/payment.entity";

export abstract class PaymentRepository {

    abstract createPayment( paymentRequest : PaymentRequestDTO  ) : Promise<PaymentEntity>;
    abstract updatePayment( paymentRequest : PaymentUpdateDto ) : Promise<PaymentEntity>
    abstract updatePaymentByIdPayment( paymentRequest : PaymentUpdateDto ) : Promise<PaymentEntity>
    abstract findPaymentsMethods( ) : Promise<PaymentMethodsResponse[]>;
    abstract findIdentificationTypes( ) : Promise<IdentificationTypesResponse[]>;
    
}