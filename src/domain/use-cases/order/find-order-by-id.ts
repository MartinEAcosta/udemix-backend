import { OrderGatewayResult } from "../../dtos/payment/payment.response";
import { OrderRepository } from "../../repository/order-repository";

interface FindOrderByIdUseCase {
    execute( id : string ) : Promise<OrderGatewayResult>;
}

export class FindOrderById implements FindOrderByIdUseCase {

    constructor(
        private readonly orderRepository : OrderRepository,
    ) { }

    async execute( id : string ) : Promise<OrderGatewayResult> {
        return this.orderRepository.findOrderById( id );
    }

}
