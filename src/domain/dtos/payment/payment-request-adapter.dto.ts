import { ItemQuantity } from "./payment.response";

export class PaymentRequestAdapterDto {

    constructor( 
        public readonly items             : ItemQuantity[],
        public readonly token             : string,
        public readonly description       : string,
        public readonly issuer_id         : number,
        public readonly payment_method_id : string,
        public readonly payer             : {
                                                email : string,
                                                identification: {
                                                    type : string,
                                                    number : number,
                                                }
                                            },
        public readonly installments : string,
        public readonly transaction_amount ?: number,
        public readonly code              ?: string,
    ) { }


    static create = ( props : { [ key : string ] : any } ) : [ string?, PaymentRequestAdapterDto? ]  => {
        const { items , token , payment_method_id, issuer_id , email, installments = 1, identificationType, identificationNumber , code = undefined } = props;

        if( !token ) return ['El token es obligatorio', undefined];
        if (!email) return ['El email del pagador es requerido.', undefined];
        if( !payment_method_id ) return ['El método de pago es requerido.' , undefined ];
        if( !identificationType ) return ['El tipo de identificación es requerido.' , undefined ];
        if( !identificationNumber ) return ['El número de identificación es requerido.' , undefined ];

        const installmentsRef = Number(installments) || 1;

        return [undefined , new PaymentRequestAdapterDto( 
                                                
                                                    items,
                                                    token,
                                                    `Pago de ${ items.length } cursos.`,
                                                    issuer_id,
                                                    payment_method_id,
                                                    {   
                                                        email,
                                                        identification : {
                                                            type : identificationType,
                                                            number : identificationNumber,
                                                        }
                                                    },
                                                    installmentsRef.toString(),
                                                    code
                                                )];
    }

}