import { PaymentCreateDto } from "../dtos/payment/payment-create.dto";
import { IdentificationTypesResponse, PaymentMethodsResponse, PaymentRequestAdapter } from "../dtos/payment/payment.response";
import { UserEntity } from "../entities/user.entity";

export abstract class PaymentDataSource {

    abstract createPayment( paymentRequestDto : PaymentCreateDto , user : UserEntity ) : Promise<any>;
    abstract findPaymentsMethods( ) : Promise<PaymentMethodsResponse[]>;
    abstract findIdentificationTypes( ) : Promise<IdentificationTypesResponse[]>;
    
}
