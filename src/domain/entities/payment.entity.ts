
interface PaymentEntityOptions {
    id : string;
    id_user : string;
    id_courses : string[];
    id_payment : string;
    amount     : number;
    date       : Date;
    method     : string;
    status     : string;
}


export class PaymentEntity {

    public id : string;
    public id_user : string;
    public id_courses : string[];
    public id_payment : string;
    public amount     : number;
    public date       : Date;
    public method     : string;
    public status     : string;

    private constructor( options : PaymentEntityOptions ) {
        const { id , id_user, id_courses, id_payment, amount, date, method, status } = options;
        this.id = id;
        this.id_user = id_user;
        this.id_courses = id_courses;
        this.id_payment = id_payment;
        this.amount = amount;
        this.date = date;
        this.method = method;
        this.status = status; 
    }

    static fromObject = ( object: { [ key: string ] : any } ) : PaymentEntity => {
        const { id , id_user, id_courses, id_payment, amount, date, method, status } = object;

        if( !id_user ) throw 'El id_user es requerido.';
        if( !id_courses ) throw 'El id de el/los curso/s son requeridos.';
        if( !id_payment ) throw 'El id del pago es requerido.'
        if( !amount ) throw 'El monto de la transacción es requerido.'
        if( !date ) throw 'La fecha de la transacción es requerida.'

        return new PaymentEntity(
            {
                id, 
                id_user,
                id_courses,
                id_payment,
                amount,
                date,
                method,
                status
            }
        )
        
    }
}