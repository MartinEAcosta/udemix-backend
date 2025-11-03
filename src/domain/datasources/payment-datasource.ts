import { PaymentCreateDto } from "../dtos/payment/payment-create.dto";
import { PaymentRequestAdapterDto } from "../dtos/payment/payment-request-adapter.dto";
import { IdentificationTypesResponse, PaymentMethodsResponse } from "../dtos/payment/payment.response";
import { PaymentEntity } from "../entities/payment.entity";
import { UserEntity } from "../entities/user.entity";

export abstract class PaymentDataSource {

    abstract startPayment( paymentRequest : PaymentRequestAdapterDto ) : Promise<any>;
    abstract createPayment( paymentRequest : PaymentCreateDto ) : Promise<PaymentEntity>;
    abstract updatePayment( paymentRequest : any ) : Promise<any>;
    abstract findPaymentById( id : number ) : Promise<any>;
    abstract findPaymentsMethods( ) : Promise<PaymentMethodsResponse[]>;
    abstract findIdentificationTypes( ) : Promise<IdentificationTypesResponse[]>;
    
}
