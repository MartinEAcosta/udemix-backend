import { CardToken, PaymentMethod, Payment, IdentificationType } from 'mercadopago';
import { PaymentService } from '../../domain/services';
import { PaymentRequestAdapter } from '../../domain/dtos/payment/payment.response';
import { PaymentMethodResponse } from 'mercadopago/dist/clients/order/commonTypes';
import { IdentificationTypeResponse } from 'mercadopago/dist/clients/identificationType/list/types';
import MercadoPago from 'mercadopago';

export class MercadoPagoAdapter implements PaymentService{

    private readonly client  : MercadoPago;
    private readonly payment : Payment;
    private readonly paymentMethods : PaymentMethod;
    private readonly cardToken : CardToken;
    private readonly identificationType : IdentificationType;

    constructor( accessToken : string ) {
        this.client = new MercadoPago( {
            accessToken: accessToken
        } );
        this.payment = new Payment( this.client );
        this.paymentMethods = new PaymentMethod( this.client );
        this.cardToken = new CardToken( this.client );
        this.identificationType = new IdentificationType( this.client );
    }

    async createPayment( paymentRequestAdapter : PaymentRequestAdapter ): Promise<any> {
        const createdPayment = await this.payment.create({ body: { ...paymentRequestAdapter } });
        console.log(createdPayment);
        return createdPayment;
    }

    async findPaymentsMethods( ) : Promise<PaymentMethodResponse[]> {
        const paymentsMethods = await this.paymentMethods.get();
        // console.log(paymentsMethods);
        return paymentsMethods;
    }
    
    async findIdentificationTypes( ) : Promise<IdentificationTypeResponse[]> {
        const identificationTypes = await this.identificationType.list();

        return identificationTypes;
    }

};