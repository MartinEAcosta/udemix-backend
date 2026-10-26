import { PaymentDataSource } from "../../domain/datasources/payment-datasource";
import { IdentificationTypesResponse, PaymentMethodsResponse } from "../../domain/dtos/payment/payment.response";
import { PaymentRepository } from "../../domain/repository/payment-repository";
import { PaymentEntity } from "../../domain/entities/payment.entity";
import { PaymentUpdateDto } from "../../domain/dtos/payment/payment-update.dto";
import { PaymentRequestDTO } from "../../domain/dtos/payment/payment-request.dto";

export class PaymentRepositoryImpl implements PaymentRepository {

    constructor( 
        private readonly paymentDatasource : PaymentDataSource,
    ){ }
    
    async createPayment( paymentRequest : PaymentRequestDTO  ) : Promise<PaymentEntity> {
        try{
            const payment = await this.paymentDatasource.createPayment( paymentRequest );
            return PaymentEntity.fromObject( payment );
        }
        catch( error ){
            throw error;
        }
    }

    async updatePayment( paymentRequest : PaymentUpdateDto ) : Promise<PaymentEntity> {
        try{
            const updatedPayment = await this.paymentDatasource.updatePayment( paymentRequest );
            return PaymentEntity.fromObject( updatedPayment );
        }
        catch( error ){
            throw error;
        }
    }

    async updatePaymentByIdPayment( paymentRequest : PaymentUpdateDto ) : Promise<PaymentEntity> {
        try{
            const updatedPayment = await this.paymentDatasource.updatePaymentByIdPayment( paymentRequest );
            return PaymentEntity.fromObject( updatedPayment );
        }
        catch( error ){
            throw error;
        }
    }
    
    async findPaymentsMethods() : Promise<PaymentMethodsResponse[]> {
        try{
            const paymentsMethods = await this.paymentDatasource.findPaymentsMethods();
            return paymentsMethods;
        }
        catch( error ) {
            throw error;
        }
    }

    async findIdentificationTypes(): Promise<IdentificationTypesResponse[]>  {
        try{
            const identificationTypes  = await this.paymentDatasource.findIdentificationTypes();
            return identificationTypes;
        }
        catch( error ) {
            throw error;
        }
    }

}