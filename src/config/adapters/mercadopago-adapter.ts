import MercadoPago from 'mercadopago';
import { CardToken, PaymentMethod, Payment, IdentificationType, CustomerCard } from 'mercadopago';
import { IdentificationTypeResponse } from 'mercadopago/dist/clients/identificationType/list/types';

import { PaymentService } from '../../domain/services';
import { PaymentMethodResponse } from 'mercadopago/dist/clients/order/commonTypes';
import { PaymentCreateDto } from '../../domain/dtos/payment/payment-create.dto';

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

    async createPayment( paymentRequestAdapter : PaymentCreateDto ): Promise<any> {
        console.log(
            paymentRequestAdapter
        )
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
                                                                console.log(error);
                                                                throw error;
                                                            });
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