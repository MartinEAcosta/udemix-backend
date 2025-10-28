import { CartItem } from "./payment.response";

export class PaymentCreateDto {

    constructor( 
        public readonly items             : string[],
        public readonly token             : string,
        public readonly description       : string,
        public readonly issuer_id         : number,
        public readonly payment_method_id : string,
        public readonly payer             : {
                                                identificationType : string,
                                                identificationNumber : number,
                                            },
        public readonly code              ?: string,
    ) { }


    static create = ( props : { [ key : string ] : any } ) : [ string?, PaymentCreateDto? ]  => {
        const { items , token , payment_method_id , identificationType, identificationNumber , code } = props;

        if( !token ) return ['El token es obligatorio', undefined];
        if( !payment_method_id ) return ['El método de pago es requerido.' , undefined ];
        if( !identificationType ) return ['El tipo de identificación es requerido.' , undefined ];
        if( !identificationNumber ) return ['El número de identificación es requerido.' , undefined ];

        let cartItems = [];
        for ( let item of items as CartItem[] ) {
            if( !item.course.id ) return ['El id del curso es requerido en cada item del carrito.' , undefined ];
            cartItems.push( item.course.id );
        }

        console.log('moidsnad')
        return [undefined , new PaymentCreateDto( 
                                                
                                                    cartItems,
                                                    token,
                                                    `Pago de ${ items.length } cursos.`,
                                                    2,
                                                    payment_method_id,
                                                    {
                                                        identificationType,
                                                        identificationNumber,
                                                    },
                                                    code
                                                )];
    }

}