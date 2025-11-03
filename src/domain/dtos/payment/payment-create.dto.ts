import { stat } from "fs";
import { ItemQuantity } from "./payment.response";

export class PaymentCreateDto {

    constructor( 
        public readonly id_user : string,
        public readonly id_courses : string[],
        public readonly id_payment : number,
        public readonly amount : number,
        public readonly date : Date,
        public readonly method : string,
        public readonly status : string,
    ) { }


    static create = ( props : { [ key : string ] : any } ) : [ string?, PaymentCreateDto? ]  => {
        const { id_user , id_courses , id_payment , amount , date , method , status } = props;

        if (!id_user ) return ['El id del usuario que va obtener el curso no puede estar vació.', undefined];
        if (!id_courses) return ['El id de el/los curso/s a comprar no puede estar vació.', undefined];
        if (!amount) return ['El monto final no puede estar vació.', undefined];
        if (!date) return ['La fecha de emisión del pago no puede estar vacía.']
        if ( method != 'card' || method != 'balance' ) return ['Método de pago invalido.', undefined];
        if (!status) return ['El estado del pago no puede ser nulo.' , undefined]

        return [undefined , new PaymentCreateDto( 
                                                    id_user,
                                                    id_courses,
                                                    id_payment,
                                                    amount,
                                                    date,
                                                    method,
                                                    status
                                                )];
    }

}