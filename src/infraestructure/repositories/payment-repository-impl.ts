import { PaymentDataSource } from "../../domain/datasources/payment-datasource";
import { IdentificationTypesResponse, PaymentMethodsResponse } from "../../domain/dtos/payment/payment.response";
import { PaymentRepository } from "../../domain/repository/payment-repository";
import { PaymentEntity } from "../../domain/entities/payment.entity";
import { PaymentRequestAdapterDto } from "../../domain/dtos/payment/payment-request-adapter.dto";
import { PaymentCreateDto } from "../../domain/dtos/payment/payment-create.dto";

export class PaymentRepositoryImpl implements PaymentRepository {

    constructor( 
        private readonly paymentDatasource : PaymentDataSource,
    ){ }
    
    async startPayment( paymentRequest : PaymentRequestAdapterDto  ) : Promise<PaymentEntity | null> {
        try{
            const paymentResponse = await this.paymentDatasource.startPayment( paymentRequest );
            if ( !paymentResponse ) return null;
            
            return paymentResponse;
        }
        catch( error ) {
            throw error;
        }
    }

    async createPayment( paymentRequest : PaymentCreateDto ) : Promise<PaymentEntity> {
        try{
            const payment = await this.paymentDatasource.createPayment( paymentRequest );

            return payment;
        }
        catch( error ){
            throw error;
        }
    }

    async updatePayment( paymentRequest : any ) : Promise<PaymentEntity> {
        throw new Error("Method not implemented.");
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