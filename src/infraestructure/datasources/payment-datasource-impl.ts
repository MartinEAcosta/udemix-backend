import { PaymentDataSource } from '../../domain/datasources/payment-datasource';
import { IdentificationTypesResponse, PaymentMethodsResponse, PaymentRequestAdapter } from '../../domain/dtos/payment/payment.response';
import { PaymentService } from '../../domain/services';


export class PaymentDataSourceImpl implements PaymentDataSource {

    constructor( 
        private readonly paymentService : PaymentService
    ) { }
    
    async createPayment( paymentRequestDto : PaymentRequestAdapter ) : Promise<any> {
        const paymentResponse = await this.paymentService.createPayment( paymentRequestDto );
        console.log(paymentResponse);
        
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