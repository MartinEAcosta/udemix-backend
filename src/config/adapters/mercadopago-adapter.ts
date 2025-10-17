import { CardToken, MercadoPagoConfig, Payment  } from 'mercadopago';

export class MercadoPagoAdapter {

    private readonly client  : MercadoPagoConfig;
    private readonly payment : Payment;
    private readonly cardToken : CardToken;

    constructor( accessToken : string ) {
        this.client = new MercadoPagoConfig( {
            accessToken: accessToken
        } );
        this.payment = new Payment( this.client );
        this.cardToken = new CardToken( this.client );
    }
};