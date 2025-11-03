import { PaymentModel } from '../../data/mongo/models/payment.model';
import { PaymentDataSource } from '../../domain/datasources/payment-datasource';
import { PaymentCreateDto } from '../../domain/dtos/payment/payment-create.dto';
import { PaymentRequestAdapterDto } from '../../domain/dtos/payment/payment-request-adapter.dto';
import { IdentificationTypesResponse, PaymentMethodsResponse } from '../../domain/dtos/payment/payment.response';
import { PaymentEntity } from '../../domain/entities/payment.entity';
import { PaymentService } from '../../domain/services';
import { PaymentMapper } from '../mappers/payment.mapper';


export class PaymentDataSourceImpl implements PaymentDataSource {

    constructor( 
        private readonly paymentService : PaymentService
    ) { }
    
    async startPayment( paymentRequest : PaymentRequestAdapterDto ) : Promise<any> {
        const paymentResponse = await this.paymentService.createPayment( paymentRequest );
        if( !paymentResponse ) return null;
        
        return paymentResponse
    }

    async createPayment( paymentRequest : PaymentCreateDto ) : Promise<PaymentEntity> {

        const paymentToSave = await PaymentModel.create({ 
            ...paymentRequest
        });
        console.log( paymentToSave );
        return PaymentMapper.fromModelToEntity( paymentToSave );
    }
    
    updatePayment(paymentRequest: any): Promise<any> {
        throw new Error('Method not implemented.');
    }

    async findPaymentById( id : number ) : Promise<any> {
        const paymentResponse = await this.paymentService.findPaymentById( id );
        return paymentResponse;
    }

    async findPaymentsMethods() : Promise<PaymentMethodsResponse[]> {
        const paymentsMethods = await this.paymentService.findPaymentsMethods();
        return paymentsMethods;
    }
    
    async findIdentificationTypes() : Promise<IdentificationTypesResponse[]> {
        const identificationTypes = await this.paymentService.findIdentificationTypes();
        return identificationTypes;
    }

}