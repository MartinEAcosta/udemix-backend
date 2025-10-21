import { CardToken, MercadoPagoConfig, PaymentMethod } from 'mercadopago';
import { PaymentService } from '../../domain/services';

export class MercadoPagoAdapter implements PaymentService{

    private readonly client  : MercadoPagoConfig;
    private readonly payment : PaymentMethod;
    private readonly cardToken : CardToken;

    constructor( accessToken : string ) {
        this.client = new MercadoPagoConfig( {
            accessToken: accessToken
        } );
        this.payment = new PaymentMethod( this.client );
        this.cardToken = new CardToken( this.client );
    }

    async createPayment(): Promise<any> {
        throw new Error('Method not implemented.');
    }

    async findPaymentsMethods(): Promise<any> {
        const paymentsMethods = await this.payment.get();
        // console.log(paymentsMethods);
        return paymentsMethods;
    }

};