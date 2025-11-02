import { PaymentCreateDto } from "../dtos/payment/payment-create.dto";
import { IdentificationTypesResponse, PaymentMethodsResponse } from "../dtos/payment/payment.response";
import { PaymentEntity } from "../entities/payment.entity";
import { UserEntity } from "../entities/user.entity";


export abstract class PaymentRepository {

    abstract createPayment( paymentRequest : PaymentCreateDto , user : UserEntity ) : Promise<PaymentEntity | null>;
    abstract findPaymentsMethods( ) : Promise<PaymentMethodsResponse[]>;
    abstract findIdentificationTypes( ) : Promise<IdentificationTypesResponse[]>;
    
}