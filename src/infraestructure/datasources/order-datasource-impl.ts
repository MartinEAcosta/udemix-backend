import { OrderDataSource } from "../../domain/datasources/order-datasource";
import { OrderRequestAdapterDto } from "../../domain/dtos/order/order-request-adapter.dto";
import { OrderGatewayResult } from "../../domain/dtos/payment/payment.response";
import { PaymentService } from "../../domain/services";

export class OrderDataSourceImpl implements OrderDataSource {

    constructor(
        private readonly paymentService : PaymentService
    ) { }

    async createOrder( orderRequest : OrderRequestAdapterDto ) : Promise<OrderGatewayResult> {
        return this.paymentService.createOrder( orderRequest );
    }

    async findOrderById( id : string ) : Promise<OrderGatewayResult> {
        return this.paymentService.findOrderById( id );
    }

}
