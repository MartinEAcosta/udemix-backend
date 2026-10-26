import MercadoPago, { Order } from 'mercadopago';
import { PaymentMethod, IdentificationType } from 'mercadopago';

import { PaymentService } from '../../domain/services';
import { OrderRequestAdapterDto } from '../../domain/dtos/order/order-request-adapter.dto';
import { OrderMapper } from '../../infraestructure/mappers/order.mapper';
import { PaymentMethodsResponse, IdentificationTypesResponse, OrderGatewayResult } from '../../domain/dtos/payment/payment.response';

export class MercadoPagoAdapter implements PaymentService{

    private readonly client  : MercadoPago;
    private readonly order : Order;
    private readonly paymentMethods : PaymentMethod;
    private readonly identificationType : IdentificationType;

    constructor( accessToken : string ) {
        this.client = new MercadoPago( {
            accessToken: accessToken
        } );
        this.order = new Order( this.client );
        this.paymentMethods = new PaymentMethod( this.client );
        this.identificationType = new IdentificationType( this.client );
    }

    async createOrder( orderRequestAdapter : OrderRequestAdapterDto ): Promise<OrderGatewayResult> {
        try{
            const createdOrder = await this.order.create(
                                                            {
                                                                body: OrderMapper.fromOrderRequestAdapterDtoToCreateOrderRequest( orderRequestAdapter ),
                                                            })
                                                            .catch( (error) => {
                                                                console.log(JSON.stringify(error, null, 2));
                                                                throw error;
                                                            });
            return OrderMapper.fromMercadoPagoResponseToGatewayResult( createdOrder );
        }
        catch( error ){
            throw error;
        }
    }

    async findOrderById( id : string ) : Promise<OrderGatewayResult> {
        try{
            const orderResponse = await this.order.get({ id });
            
            return OrderMapper.fromMercadoPagoResponseToGatewayResult( orderResponse );
        }
        catch( error ) {
            throw error;
        }
    }

    async findPaymentsMethods( ) : Promise<PaymentMethodsResponse[]> {
        try{
            const paymentsMethods = await this.paymentMethods.get();

            return OrderMapper.fromPaymentMethodsAdapterResponseToPaymentMethodsResponse( paymentsMethods );
        }
        catch( error ){
            throw error;
        }

    }

    async findIdentificationTypes( ) : Promise<IdentificationTypesResponse[]> {
        try{
            const identificationTypes = await this.identificationType.list();

            return OrderMapper.fromIdentificationTypesAdapterResponseToIdentificationTypesResponse( identificationTypes );
        }
        catch( error ){
            throw error;
        }

    }

};