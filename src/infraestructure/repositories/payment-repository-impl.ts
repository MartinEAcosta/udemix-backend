import { PaymentDataSource } from "../../domain/datasources/payment-datasource";
import { PaymentMethodsResponse } from "../../domain/dtos/payment/payment.response";
import { PaymentRepository } from "../../domain/repository/payment-repository";
import { PaymentCreateDto } from '../../domain/dtos/payment/payment-create.dto';

export class PaymentRepositoryImpl implements PaymentRepository {

    constructor( 
        private readonly paymentDatasource : PaymentDataSource,
    ){ }

    async createPayment( paymentRequestDto : any ) : Promise<any> {
        
        const paymentResponse = await this.paymentDatasource.createPayment( paymentRequestDto );

        return paymentResponse;
    }

    async findPaymentsMethods() : Promise<PaymentMethodsResponse[]> {

        const paymentsMethods = await this.paymentDatasource.findPaymentsMethods();

        return paymentsMethods;
    }

}