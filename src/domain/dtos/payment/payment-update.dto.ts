
/**
 * Lo que un update de pago puede escribir. Sin `create( props )`: los dos flujos que actualizan
 * un pago son internos (checkout y webhook), ninguno viene de un body de usuario.
 *
 * `id` es el filtro, no un campo: no se escribe.
 */
export class PaymentUpdateDto {

    private constructor(
        public readonly id_payment  : string,
        public readonly status      : string,
        public readonly id         ?: string,
        public readonly date       ?: Date,
        public readonly method     ?: string,
    ) { }

    /** Checkout: el pago local ya existe y la pasarela devolvió su id y estado. */
    static fromGatewayOrder = (
        id : string,
        id_payment : string,
        status : string,
        method ?: string,
    ) : PaymentUpdateDto => {
        return new PaymentUpdateDto( id_payment , status , id , new Date() , method );
    }

    /** Webhook: se resuelve por el id de la pasarela, sin conocer el id local. */
    static statusFromGateway = ( id_payment : string , status : string ) : PaymentUpdateDto => {
        return new PaymentUpdateDto( id_payment , status , undefined , new Date() );
    }
}
