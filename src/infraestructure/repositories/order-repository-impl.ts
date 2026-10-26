import { OrderDataSource } from "../../domain/datasources/order-datasource";
import { OrderRequestAdapterDto } from "../../domain/dtos/order/order-request-adapter.dto";
import { OrderGatewayResult } from "../../domain/dtos/payment/payment.response";
import { OrderRepository } from "../../domain/repository/order-repository";

export class OrderRepositoryImpl implements OrderRepository {

    constructor(
        private readonly orderDatasource : OrderDataSource,
    ) { }

    async createOrder( orderRequest : OrderRequestAdapterDto ) : Promise<OrderGatewayResult> {
        try {
            return await this.orderDatasource.createOrder( orderRequest );
        }
        catch( error ) {
            throw error;
        }
    }

    async findOrderById( id : string ) : Promise<OrderGatewayResult> {
        try {
            return await this.orderDatasource.findOrderById( id );
        }
        catch( error ) {
            throw error;
        }
    }

}
