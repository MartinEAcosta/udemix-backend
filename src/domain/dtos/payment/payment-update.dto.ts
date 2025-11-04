
export class PaymentUpdateDto {

    constructor(
        public readonly id_payment : number,
        public readonly status : string,
        public readonly id ?: string,
        public readonly date ?: Date,
        public readonly method ?: string,
    ) { }

    static create = ( props : { [ key : string ] : any } ) : [ string?, PaymentUpdateDto? ]  => {
        const { id , id_payment , date , method , status } = props;
    
        if( !id ) return ['El id de la entidad payment a actualizar es requerido.', undefined];
        if( !id_payment ) return ['El id del pago es requerido.' , undefined];
        if( !date ) return ['La fecha en la se que actualizo es necesaria.' , undefined];
        if ( method != 'card' && method != 'balance' ) return ['Método de pago invalido.', undefined];
        if (!status) return ['El estado del pago no puede ser nulo.' , undefined]

        return [ undefined , new PaymentUpdateDto(
            id,
            id_payment,
            date,
            method,
            status,
        )]
    }
}