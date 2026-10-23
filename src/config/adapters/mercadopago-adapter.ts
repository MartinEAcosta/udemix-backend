import MercadoPago from 'mercadopago';
import { PaymentMethod, Payment, IdentificationType } from 'mercadopago';

import { PaymentService } from '../../domain/services';
import { PaymentRequestAdapterDto } from '../../domain/dtos/payment/payment-request-adapter.dto';
import { PaymentMapper } from '../../infraestructure/mappers/payment.mapper';
import { PaymentGatewayResult, PaymentMethodsResponse, IdentificationTypesResponse } from '../../domain/dtos/payment/payment.response';

export class MercadoPagoAdapter implements PaymentService{

    private readonly client  : MercadoPago;
    private readonly payment : Payment;
    private readonly paymentMethods : PaymentMethod;
    private readonly identificationType : IdentificationType;

    constructor( accessToken : string ) {
        this.client = new MercadoPago( {
            accessToken: accessToken
        } );
        this.payment = new Payment( this.client );
        this.paymentMethods = new PaymentMethod( this.client );
        this.identificationType = new IdentificationType( this.client );
    }

    async createPayment( paymentRequestAdapter : PaymentRequestAdapterDto ): Promise<PaymentGatewayResult> {
        try{
            const createdPayment = await this.payment.create(
                                                            { 
                                                                body: { 
                                                                        token: paymentRequestAdapter.token,
                                                                        transaction_amount: paymentRequestAdapter.transaction_amount,
                                                                        description: paymentRequestAdapter.description,
                                                                        payment_method_id: paymentRequestAdapter.payment_method_id,
                                                                        issuer_id: paymentRequestAdapter.issuer_id,
                                                                        payer: {
                                                                            email: paymentRequestAdapter.payer.email,
                                                                            identification: {
                                                                                type: paymentRequestAdapter.payer.identification.type,
                                                                                number: paymentRequestAdapter.payer.identification.number.toString(),
                                                                            },
                                                                        },
                                                                        installments: Number(paymentRequestAdapter.installments) || 1,
                                                                        notification_url: 'https://prerailroad-tamia-voluptuous.ngrok-free.dev/api/payments/notifications?source_news=webhooks',
                                                                    },
                                                                }).catch( (error) => {
                                                                    throw error;
                                                                });
            return PaymentMapper.fromMercadoPagoResponseToGatewayResult( createdPayment );
        }
        catch( error ){
            throw error;
        }
    }

    async findPaymentById( id : number ) : Promise<PaymentGatewayResult> {
        try{
            const paymentResponse = await this.payment.get({ id });
            
            return PaymentMapper.fromMercadoPagoResponseToGatewayResult( paymentResponse );
        }
        catch( error ) {
            throw error;
        }
    }

    async findPaymentsMethods( ) : Promise<PaymentMethodsResponse[]> {
        try{
            const paymentsMethods = await this.paymentMethods.get();

            return PaymentMapper.fromPaymentMethodsAdapterResponseToPaymentMethodsResponse( paymentsMethods );
        }
        catch( error ){
            throw error;
        }

    }

    async findIdentificationTypes( ) : Promise<IdentificationTypesResponse[]> {
        try{
            const identificationTypes = await this.identificationType.list();

            return PaymentMapper.fromIdentificationTypesAdapterResponseToIdentificationTypesResponse( identificationTypes );
        }
        catch( error ){
            throw error;
        }

    }

};