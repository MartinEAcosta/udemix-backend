
export class PaymentCreateDto {

    constructor( 
           public readonly items             : Array<string>,
           public readonly description       : string,
           public readonly issuer_id         : number,
           public readonly payment_method_id : string,
           public readonly payer             : {
                                                identificationType : string,
                                                number : number,
                                               }
    ) { }


    static create = ( props : { [ key : string ] : any } ) : [ string?, PaymentCreateDto? ]  => {
        const { cart , payment_method_id , identificationType, number } = props;

        if( !cart || !Array.isArray(cart) || cart.length === 0 ) return ['El carrito de compras es requerido.' , undefined ];
        if( !payment_method_id ) return ['El método de pago es requerido.' , undefined ];
        if( !identificationType ) return ['El tipo de identificación es requerido.' , undefined ];
        if( !number ) return ['El número de identificación es requerido.' , undefined ];

        let items : Array<string> = [];
        for ( const item of cart ) {
            if( !item.id_course ) return ['El id del curso es requerido en cada item del carrito.' , undefined ];
            items.push( item.id_course );
        }

        return [undefined , new PaymentCreateDto( 
                                                
                                                    items,
                                                    `Pago de ${ items.length } cursos.`,
                                                    2,
                                                    payment_method_id,
                                                    {
                                                        identificationType,
                                                        number,
                                                    }
                                                )];
    }

}