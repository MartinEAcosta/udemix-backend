import { PaymentDataSource } from "../../domain/datasources/payment-datasource";
import { IdentificationTypesResponse, PaymentMethodsResponse } from "../../domain/dtos/payment/payment.response";
import { PaymentRepository } from "../../domain/repository/payment-repository";
import { PaymentCreateDto } from '../../domain/dtos/payment/payment-create.dto';
import { UserEntity } from "../../domain/entities/user.entity";

export class PaymentRepositoryImpl implements PaymentRepository {

    constructor( 
        private readonly paymentDatasource : PaymentDataSource,
    ){ }

    async createPayment( paymentRequestDto : PaymentCreateDto , user : UserEntity ) : Promise<any> {
        
        const paymentResponse = await this.paymentDatasource.createPayment( paymentRequestDto , user );

        return paymentResponse;
    }

    async findPaymentsMethods() : Promise<PaymentMethodsResponse[]> {

        const paymentsMethods = await this.paymentDatasource.findPaymentsMethods();

        return paymentsMethods;
    }

    async findIdentificationTypes(): Promise<IdentificationTypesResponse[]> {
        const identificationTypes  = await this.paymentDatasource.findIdentificationTypes();
        return identificationTypes;
    }

}