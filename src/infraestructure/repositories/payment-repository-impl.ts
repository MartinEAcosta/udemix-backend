import { PaymentDataSource } from "../../domain/datasources/payment-datasource";
import { IdentificationTypesResponse, PaymentMethodsResponse } from "../../domain/dtos/payment/payment.response";
import { PaymentRepository } from "../../domain/repository/payment-repository";
import { PaymentCreateDto } from '../../domain/dtos/payment/payment-create.dto';
import { UserEntity } from "../../domain/entities/user.entity";
import { PaymentEntity } from "../../domain/entities/payment.entity";

export class PaymentRepositoryImpl implements PaymentRepository {

    constructor( 
        private readonly paymentDatasource : PaymentDataSource,
    ){ }
    
    async createPayment( paymentRequestDto : PaymentCreateDto , user : UserEntity ) : Promise<PaymentEntity | null> {
        try{
            const paymentResponse = await this.paymentDatasource.createPayment( paymentRequestDto , user );
            if ( !paymentResponse ) return null;
            
            return paymentResponse;
        }
        catch( error ) {
            throw error;
        }
    }
    
    async findPaymentById( id : number ) : Promise<any> {
        try{
            const paymentResponse = await this.paymentDatasource.findPaymentById( id ); 
            return paymentResponse;
        }
        catch( error ){
            console.log(error);
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