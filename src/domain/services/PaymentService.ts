import { OrderRequestAdapterDto } from "../dtos/order/order-request-adapter.dto";
import { PaymentMethodsResponse, IdentificationTypesResponse, OrderGatewayResult } from "../dtos/payment/payment.response";

export abstract class PaymentService {

    abstract createOrder( orderRequestDto : OrderRequestAdapterDto ) : Promise<OrderGatewayResult>;
    abstract findOrderById( id : string ) : Promise<OrderGatewayResult>;
    abstract findPaymentsMethods() : Promise<PaymentMethodsResponse[]>;
    abstract findIdentificationTypes() : Promise<IdentificationTypesResponse[]>;

}
