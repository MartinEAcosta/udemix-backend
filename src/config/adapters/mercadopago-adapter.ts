import MercadoPago from 'mercadopago';
import { CardToken, PaymentMethod, Payment, IdentificationType, CustomerCard } from 'mercadopago';
import { IdentificationTypeResponse } from 'mercadopago/dist/clients/identificationType/list/types';

import { PaymentService } from '../../domain/services';
import { PaymentRequestAdapter } from '../../domain/dtos/payment/payment.response';
import { PaymentMethodResponse } from 'mercadopago/dist/clients/order/commonTypes';

export class MercadoPagoAdapter implements PaymentService{

    private readonly client  : MercadoPago;
    private readonly payment : Payment;
    private readonly paymentMethods : PaymentMethod;
    private readonly cardToken : CardToken;
    private readonly identificationType : IdentificationType;
    private readonly customerCardIssuer : CustomerCard;

    constructor( accessToken : string ) {
        this.client = new MercadoPago( {
            accessToken: accessToken
        } );
        this.payment = new Payment( this.client );
        this.paymentMethods = new PaymentMethod( this.client );
        this.cardToken = new CardToken( this.client );
        this.identificationType = new IdentificationType( this.client );
        this.customerCardIssuer = new CustomerCard( this.client );
    }

    async createPayment( paymentRequestAdapter : PaymentRequestAdapter ): Promise<any> {
        console.log(
            paymentRequestAdapter
        )
        const createdPayment = await this.payment.create({ body: { 
                                                                    ...paymentRequestAdapter,
                                                                    notification_url: 'https://prerailroad-tamia-voluptuous.ngrok-free.dev/api/payments/notifications?source_news=webhooks',
                                                                    installments: 1,
                                                                } }).catch( (error) => console.log(error));
        return createdPayment;
    }

    async findPaymentsMethods( ) : Promise<PaymentMethodResponse[]> {
        const paymentsMethods = await this.paymentMethods.get();

        return paymentsMethods;
    }
    
    async findIdentificationTypes( ) : Promise<IdentificationTypeResponse[]> {
        const identificationTypes = await this.identificationType.list();

        return identificationTypes;
    }

};