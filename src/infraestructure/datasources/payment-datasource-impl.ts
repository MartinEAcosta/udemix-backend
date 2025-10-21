import { PaymentDataSource } from '../../domain/datasources/payment-datasource';
import { PaymentMethodsResponse } from '../../domain/dtos/payment/payment.response';
import { PaymentService } from '../../domain/services';


export class PaymentDataSourceImpl implements PaymentDataSource {

    constructor( 
        private readonly paymentService : PaymentService
    ) { }

    async createPayment( paymentRequestDto : any ) : Promise<any> {
        const paymentResponse = await this.paymentService.createPayment( paymentRequestDto );

        return paymentResponse;
    }

    async findPaymentsMethods() : Promise<PaymentMethodsResponse[]> {
        const paymentsMethods = await this.paymentService.findPaymentsMethods();
        return paymentsMethods;
    }


}