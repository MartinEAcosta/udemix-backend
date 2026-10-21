import { PaymentMethodResponse } from "mercadopago/dist/clients/paymentMethod/get/types";
import { IdentificationTypeResponse } from "mercadopago/dist/clients/identificationType/list/types";
import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";

import { IPaymentModel } from "../../data/mongo/models/payment.model";
import { PaymentGatewayResult, PaymentResponseDto, PaymentMethodsResponse, IdentificationTypesResponse } from "../../domain/dtos/payment/payment.response";
import { CustomError } from "../../domain/errors/custom-error";


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

    static fromMercadoPagoResponseToGatewayResult = ( response : PaymentResponse ) : PaymentGatewayResult => {
        if( response.id === undefined || response.status === undefined ) {
            throw CustomError.internalServer('La respuesta de MercadoPago no incluye un id o status de pago válido.');
        }

        return {
            id : response.id,
            status : response.status,
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