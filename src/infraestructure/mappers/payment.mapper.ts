import { IPaymentModel } from "../../data/mongo/models/payment.model";
import { PaymentEntity } from "../../domain/entities/payment.entity";


export class PaymentMapper {

    static MapResponseToEntity = ( response : IPaymentModel ) : PaymentEntity  => {
        return {
            id : response._id.toString(),
            id_user : response.id_user.toString(),
            id_courses : response.id_courses.map( course => course._id.toString()),
            id_payment : response.id_payment,
            amount : response.amount,
            date : response.date,
            method : response.method,
            status : response.status,
        }
    }

}