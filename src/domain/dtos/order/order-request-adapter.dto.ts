type PaymentMethodType = 'credit_card' | 'debit_card' | 'ticket';

interface OrderItem {
    category_id : string;
    id_course  : string;
    title      : string;
    unit_price : string;
    quantity   : number;
}

interface OrderPayer {
    email           : string;
    first_name     ?: string;
    last_name      ?: string;
    entity_type    ?: 'individual' | 'association';
    identification ?: { type : string, number : string };
}

interface OrderPaymentMethod {
    id                    : string;            // 'visa' | 'master' | 'debvisa' | 'debmaster' | 'rapipago' | 'pagofacil'
    type                  : PaymentMethodType;
    token                ?: string;            // solo tarjetas, lo genera el Brick en el frontend
    installments         ?: number;            // solo crédito, máx. 36
    statement_descriptor ?: string;
}

interface OrderPayment {
    amount        ?: string;
    payment_method : OrderPaymentMethod;
}

export class OrderRequestAdapterDto {

    private constructor(
        public readonly type               : 'online',
        public readonly processing_mode    : 'automatic',
        public readonly description        : string,
        public readonly payer              : OrderPayer,
        public readonly transactions       : { payments : OrderPayment[] },
        public readonly items              : OrderItem[],
        public readonly total_amount       ?: string,
        public readonly external_reference ?: string,
    ) { }

    /**
     * Deriva una nueva orden con los datos que solo el servidor conoce
     * (external_reference = id del payment local, total_amount y monto por pago
     * recalculados en base al precio real de los cursos).
     */
    withServerComputedData = ( external_reference : string, amount : string ) : OrderRequestAdapterDto => {
        return new OrderRequestAdapterDto(
            this.type,
            this.processing_mode,
            this.description,
            this.payer,
            { payments : this.transactions.payments.map( p => ( { ...p, amount } ) ) },
            this.items,
            amount,
            external_reference,
        );
    }


    /**
     * props esperadas (lo que manda el front tras el onSubmit del Card Payment Brick):
     * {
     *   items               : [{ title, unit_price, quantity }],
     *   token               : string,        // tarjetas
     *   payment_method_id   : string,        // ej. 'master'
     *   payment_method_type : string,        // 'credit_card' | 'debit_card' | 'ticket'
     *   installments        : number,        // crédito
     *   payer               : { email, first_name?, last_name?, identification? },
     *   external_reference ?: string,        // id de tu orden en Mongo
     *   description        ?: string,
     * }
     */
    static create = ( props : { [ key : string ] : any } ) : [ string?, OrderRequestAdapterDto? ] => {
        const {
            items,
            payer,
            external_reference,
            description = 'Pago de cursos.',
        } = props;

        // Acepta el formato plano (onSubmit del Brick) o el formato de Mercado Pago
        // (transactions.payments[0].payment_method)
        const nestedPm = props.transactions?.payments?.[0]?.payment_method ?? {};

        const payment_method_id   = props.payment_method_id   ?? nestedPm.id;
        const payment_method_type = props.payment_method_type ?? nestedPm.type;
        const token               = props.token               ?? nestedPm.token;
        const installments        = props.installments        ?? nestedPm.installments;

        // ---------- items ----------
        if ( !Array.isArray( items ) || items.length === 0 ) return [ 'items es requerido y no puede estar vacío' ];

        let totalCents = 0;
        const cleanItems : OrderItem[] = [];

        for ( const item of items ) {
            const price    = Number( item?.unit_price );
            const quantity = Number( item?.quantity ?? 1 );

            
            if ( !item?.title )                                return [ 'cada item necesita title' ];
            if ( String( item.title ).length > 150 )           return [ 'title no puede superar 150 caracteres' ];
            if ( !Number.isFinite( price ) || price <= 0 )     return [ `unit_price inválido en "${ item.title }"` ];
            if ( !Number.isInteger( quantity ) || quantity < 1 ) return [ `quantity inválida en "${ item.title }"` ];

            const priceCents = Math.round( price * 100 );
            totalCents += priceCents * quantity;

            cleanItems.push({
                category_id : item.category_id,
                id_course  : item.id_course,
                title      : String( item.title ),
                unit_price : ( priceCents / 100 ).toFixed( 2 ),
                quantity,
            });
        }

        // ---------- medio de pago ----------
        const validTypes : PaymentMethodType[] = [ 'credit_card', 'debit_card', 'ticket' ];

        if ( !payment_method_id ) return [ 'payment_method_id es requerido' ];
        if ( !validTypes.includes( payment_method_type ) ) return [ 'payment_method_type debe ser credit_card, debit_card o ticket' ];

        const isCard = payment_method_type !== 'ticket';
        const paymentMethod : OrderPaymentMethod = { id : payment_method_id, type : payment_method_type };

        if ( isCard ) {
            if ( typeof token !== 'string' || token.length < 32 || token.length > 33 ) return [ 'token de tarjeta inválido' ];
            paymentMethod.token = token;
        }

        if ( payment_method_type === 'credit_card' ) {
            const n = Number( installments ?? 1 );
            if ( !Number.isInteger( n ) || n < 1 || n > 36 ) return [ 'installments debe ser un entero entre 1 y 36' ];
            paymentMethod.installments = n;
        }

        // ---------- payer ----------
        if ( !payer?.email ) return [ 'payer.email es requerido' ];

        const cleanPayer : OrderPayer = { email : payer.email };
        if ( payer.first_name )  cleanPayer.first_name  = payer.first_name;
        if ( payer.last_name )   cleanPayer.last_name   = payer.last_name;
        if ( payer.entity_type ) cleanPayer.entity_type = payer.entity_type;

        if ( payer.identification?.type && payer.identification?.number ) {
            cleanPayer.identification = {
                type   : String( payer.identification.type ),
                number : String( payer.identification.number ),
            };
        } else if ( !isCard ) {
            return [ 'payer.identification es requerido para Rapipago / Pago Fácil' ];
        }

        // ---------- external_reference ----------
        if ( external_reference !== undefined && !/^[A-Za-z0-9_-]{1,64}$/.test( String( external_reference ) ) ) {
            return [ 'external_reference: máx. 64 caracteres, solo letras, números, - y _' ];
        }

        return [ undefined, new OrderRequestAdapterDto(
            'online',
            'automatic',
            description,
            cleanPayer,
            { payments : [ { payment_method : paymentMethod } ] },
            cleanItems,
            undefined,
            external_reference !== undefined ? String( external_reference ) : undefined,
        ) ];
    }

}