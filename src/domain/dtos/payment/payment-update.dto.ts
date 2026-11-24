/**
 * Lo que un update de pago puede escribir. Sin `create( props )`: los dos flujos que actualizan
 * un pago son internos (checkout y webhook), ninguno viene de un body de usuario.
 *
 * Una sola clase, dos sabores mutuamente excluyentes, cada uno casado con un método del datasource:
 *  - fromGatewayOrder  -> `id` (Mongo) obligatorio  -> PaymentDatasource.updatePayment
 *  - statusFromGateway -> sólo `id_payment` (MP)    -> PaymentDatasource.updatePaymentByIdPayment
 * Cada método del datasource verifica que tenga la clave que necesita y, si no, falla como error
 * de programación (500 genérico + log), no como un 404 engañoso.
 *
 * Los factories reciben un objeto con nombre en vez de argumentos posicionales: `id`, `id_payment`
 * y `status` son los tres string, y una llamada permutada compilaba igual.
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
    static fromGatewayOrder = ( params : { id : string, id_payment : string, status : string, method ?: string } ) : PaymentUpdateDto => {
        const { id , id_payment , status , method } = params;
        return new PaymentUpdateDto( id_payment , status , id , new Date() , method );
    }

    /** Webhook: se resuelve por el id de la pasarela, sin conocer el id local. */
    static statusFromGateway = ( params : { id_payment : string , status : string } ) : PaymentUpdateDto => {
        const { id_payment , status } = params;
        return new PaymentUpdateDto( id_payment , status , undefined , new Date() );
    }
}
