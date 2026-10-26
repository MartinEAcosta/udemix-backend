export class PaymentRequestDTO {

    private constructor(
        public readonly id_user : string,
        public readonly id_courses : string[],
        public readonly amount : number,
        public readonly date : Date,
        public readonly status : string,
        public readonly id_payment : string | null,
        public readonly method ?: string,
    ) { }


    static create = ( props : { [ key : string ] : any } ) : [ string?, PaymentRequestDTO? ]  => {
        const { id_user , id_courses , id_payment = null , amount , date , method , status } = props;

        if (!id_user ) return ['El id del usuario que va obtener el curso no puede estar vació.', undefined];
        if (!id_courses) return ['El id de el/los curso/s a comprar no puede estar vació.', undefined];
        if (!amount) return ['El monto final no puede estar vació.', undefined];
        if (!date) return ['La fecha de emisión del pago no puede estar vacía.']
        if ( method !== undefined && method !== 'credit_card' && method !== 'balance' ) return ['Método de pago invalido.', undefined];
        if (!status) return ['El estado del pago no puede ser nulo.' , undefined]

        return [undefined , new PaymentRequestDTO(
                                                    id_user,
                                                    id_courses,
                                                    amount,
                                                    date,
                                                    status,
                                                    id_payment,
                                                    method,
                                                )];
    }

}