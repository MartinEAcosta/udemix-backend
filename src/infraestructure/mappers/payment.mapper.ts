import { IPaymentModel } from "../../data/mongo/models/payment.model";
import { PaymentResponse } from "../../domain/dtos/payment/payment.response";
import { PaymentEntity } from "../../domain/entities/payment.entity";


export class PaymentMapper {

    static fromModelToEntity = ( response : IPaymentModel ) : PaymentEntity  => {
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

    static fromPaymentAdapterResponseToPaymentResponse = ( response : any ) : PaymentResponse => {
        return {
            id : response.id,
            date_created : response.date_created,
            date_approved : response.date_approved,
            date_last_updated : response.date_last_updated,
            transaction_amount : response.transaction_amount,
            payer : {
                email : response.payer.email,
            },
            cardholder : {
                name : response.card.cardholder.name,
                identification : {
                    number : response.card.cardholder.identification.number,
                    type : response.card.cardholder.identification.type,
                }
            },
            status : response.status,
            status_detail : response.status_detail,
        };
    }

}