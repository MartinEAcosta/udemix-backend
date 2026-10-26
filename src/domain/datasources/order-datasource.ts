import { OrderRequestAdapterDto } from "../dtos/order/order-request-adapter.dto";
import { OrderGatewayResult } from "../dtos/payment/payment.response";

export abstract class OrderDataSource {

    abstract createOrder( orderRequest : OrderRequestAdapterDto ) : Promise<OrderGatewayResult>;
    abstract findOrderById( id : string ) : Promise<OrderGatewayResult>;

}
