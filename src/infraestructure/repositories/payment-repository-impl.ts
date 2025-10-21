import { PaymentDataSource } from "../../domain/datasources/payment-datasource";
import { PaymentMethodsResponse } from "../../domain/dtos/payment/payment.response";
import { PaymentRepository } from "../../domain/repository/payment-repository";

export class PaymentRepositoryImpl implements PaymentRepository {

    constructor( 
        private readonly paymentDatasource : PaymentDataSource,
    ){ }

    async createPayment(): Promise<any> {
        throw new Error("Method not implemented.");
    }

    async findPaymentsMethods(): Promise<PaymentMethodsResponse[]> {

        const paymentsMethods = await this.paymentDatasource.findPaymentsMethods();

        return paymentsMethods;
    }

}