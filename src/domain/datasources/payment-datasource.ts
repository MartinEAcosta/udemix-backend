import { PaymentCreateDto } from "../dtos/payment/payment-create.dto";
import { IdentificationTypesResponse, PaymentMethodsResponse } from "../dtos/payment/payment.response";
import { UserEntity } from "../entities/user.entity";

export abstract class PaymentDataSource {

    abstract createPayment( paymentRequestDto : PaymentCreateDto , user : UserEntity ) : Promise<any>;
    abstract findPaymentById( id : number ) : Promise<any>;
    abstract findPaymentsMethods( ) : Promise<PaymentMethodsResponse[]>;
    abstract findIdentificationTypes( ) : Promise<IdentificationTypesResponse[]>;
    
}
