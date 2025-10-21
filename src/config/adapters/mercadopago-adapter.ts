import { CardToken, MercadoPagoConfig, PaymentMethod, Payment } from 'mercadopago';
import { PaymentService } from '../../domain/services';
import { PaymentRequestAdapter } from '../../domain/dtos/payment/payment.response';

export class MercadoPagoAdapter implements PaymentService{

    private readonly client  : MercadoPagoConfig;
    private readonly payment : Payment;
    private readonly paymentMethods : PaymentMethod;
    private readonly cardToken : CardToken;

    constructor( accessToken : string ) {
        this.client = new MercadoPagoConfig( {
            accessToken: accessToken
        } );
        this.payment = new Payment( this.client );
        this.paymentMethods = new PaymentMethod( this.client );
        this.cardToken = new CardToken( this.client );
    }

    async createPayment( paymentRequestAdapter : PaymentRequestAdapter ): Promise<any> {
        const createdPayment = await this.payment.create({ body: { ...paymentRequestAdapter } });
        console.log(createdPayment);
        return createdPayment;
    }

    async findPaymentsMethods(): Promise<any> {
        const paymentsMethods = await this.paymentMethods.get();
        // console.log(paymentsMethods);
        return paymentsMethods;
    }

};