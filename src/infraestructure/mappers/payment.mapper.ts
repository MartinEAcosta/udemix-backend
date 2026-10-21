import { PaymentMethodResponse } from "mercadopago/dist/clients/paymentMethod/get/types";
import { IdentificationTypeResponse } from "mercadopago/dist/clients/identificationType/list/types";

import { IPaymentModel } from "../../data/mongo/models/payment.model";
import { PaymentCreatedResponseDto, PaymentResponseDto, PaymentMethodsResponse, IdentificationTypesResponse } from "../../domain/dtos/payment/payment.response";
import { PaymentEntity } from "../../domain/entities/payment.entity";


export class PaymentMapper {

    static fromPaymentResponseDto = ( response : IPaymentModel ) : PaymentResponseDto  => {
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

    static fromPaymentCreatedAdapterResponseToPaymentCreatedResponse = ( response : any ) : PaymentCreatedResponseDto => {
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

    static fromPaymentMethodsAdapterResponseToPaymentMethodsResponse = ( response : PaymentMethodResponse[] ) : PaymentMethodsResponse[] => {
        return response.map( method => ({
            id : method.id ?? '',
            name : method.name ?? '',
            payment_type_id : method.payment_type_id ?? '',
            status : method.status ?? '',
            secure_thumbnail : method.secure_thumbnail ?? '',
            thumbnail : method.thumbnail ?? '',
            deferred_capture : method.deferred_capture ?? '',
            settings : ( method.settings ?? [] ).map( setting => ({
                card_number : setting.card_number,
                security_code : setting.security_code,
            })),
            additional_info_needed : method.additional_info_needed ?? [],
            min_allowed_amount : method.min_allowed_amount ?? 0,
            max_allowed_amount : method.max_allowed_amount ?? 0,
            accreditation_time : method.accreditation_time ?? 0,
            financial_institutions : method.financial_institutions ?? [],
            processing_modes : method.processing_modes ?? [],
        }));
    }

    static fromIdentificationTypesAdapterResponseToIdentificationTypesResponse = ( response : IdentificationTypeResponse[] ) : IdentificationTypesResponse[] => {
        return response.map( type => ({
            id : type.id ?? '',
            name : type.name ?? '',
            type : type.type ?? '',
            min_length : type.min_length,
            max_length : type.max_length,
        }));
    }

}