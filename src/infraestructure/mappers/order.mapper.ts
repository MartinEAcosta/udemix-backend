import { PaymentMethodResponse } from "mercadopago/dist/clients/paymentMethod/get/types";
import { CreateOrderRequest } from "mercadopago/dist/clients/order/create/types";

import { OrderRequestAdapterDto } from "../../domain/dtos/order/order-request-adapter.dto";
import { IdentificationTypeResponse } from "mercadopago/dist/clients/identificationType/list/types";
import { IdentificationTypesResponse, OrderGatewayResult, PaymentMethodsResponse } from "../../domain/dtos/payment/payment.response";
import { CustomError } from "../../domain/errors/custom-error";
import { OrderResponse } from "mercadopago/dist/clients/order/commonTypes";


export class OrderMapper {    
    
    static fromMercadoPagoResponseToGatewayResult = ( response : OrderResponse ) : OrderGatewayResult => {
        if( response.id === undefined || response.status === undefined ) {
            throw CustomError.internalServer('La respuesta de MercadoPago no incluye un id o status de pago válido.');
        }

        return {
            id : response.id,
            status : response.status,
        };
    }

    static fromOrderRequestAdapterDtoToCreateOrderRequest = ( dto : OrderRequestAdapterDto ) : CreateOrderRequest => {
        return {
            type               : dto.type,
            processing_mode    : dto.processing_mode,
            capture_mode       : 'automatic_async',
            total_amount       : dto.total_amount,
            description        : dto.description,
            ...( dto.external_reference && { external_reference : dto.external_reference } ),
            payer              : { ...dto.payer },
            transactions       : {
                payments : 
                    dto.transactions.payments.map( payment => ({
                    amount         : payment.amount,
                    payment_method : { 
                        ...payment.payment_method,
                        statement_descriptor : 'UDEMIX - Plataforma educacional'
                    },
                })),
            },
            items              : dto.items.map( item => ({
                category_id   : item.category_id,
                title         : item.title,
                unit_price    : item.unit_price,
                quantity      : item.quantity,
                external_code : item.id_course,
            }) ),
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