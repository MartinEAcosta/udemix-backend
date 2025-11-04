import { Request, Response } from "express";

import { PaymentRepository } from "../../domain/repository/payment-repository";
import { HandlerResponses } from "../helpers/handler-responses";
import { CustomError } from "../../domain/errors/custom-error";
import { StartPayment } from "../../domain/use-cases/payment/start-payment";
import { CourseRepository } from "../../domain/repository";
import { AuthRepository } from '../../domain/repository/auth-repository';
import { FindPaymentsMethods } from "../../domain/use-cases/payment/find-payments-methods";
import { AuthenticatedRequest } from "../middlewares";
import { PaymentRequestAdapterDto } from "../../domain/dtos/payment/payment-request-adapter.dto";
import { FindIdentificationTypes } from "../../domain/use-cases/payment/find-identification-types";
import { CalculateTotal } from "../../domain/use-cases/payment/calculate-total";
import { WebhookPayload } from "../../domain/dtos/payment/payment.response";
import { CheckStatusById } from "../../domain/use-cases/payment/check-status-by-id";


export class PaymentController {

    constructor(
        private readonly paymentRepository : PaymentRepository,
        private readonly courseRepository  : CourseRepository,
        private readonly authRepository    : AuthRepository,
    ){ }

    public webhookHandler = ( req : Request , res : Response ) => {

        const { action , data } : WebhookPayload = req.body;

        if( action.includes('payment') ) {
            new CheckStatusById( this.paymentRepository )
                .execute( data.id )
                .then( () => {} )
                .catch( error => { console.log(error); return HandlerResponses.handleError( error , res )});
        }
        return HandlerResponses.handleSuccess( res , 'Se recibio la notificación correctamente', 200);
    }

    public startPayment = ( req : AuthenticatedRequest , res : Response ) => {
        const { user } = req;
        if( !user ) throw HandlerResponses.handleError(CustomError.unauthorized('No hay usuario en la petición.') , res );

        const [ error , paymentRequestDto ] = PaymentRequestAdapterDto.create( req.body );
        if( error ) throw HandlerResponses.handleError( CustomError.badRequest(error) , res );

        new StartPayment( this.paymentRepository, this.courseRepository , this.authRepository )
            .execute( paymentRequestDto! , user )
            .then( paymentResponse => HandlerResponses.handleSuccess( res , paymentResponse , 201 ))
            .catch( error => { console.log(error); return HandlerResponses.handleError( error , res )});
    }

    public findPaymentsMethods = ( req : Request  , res : Response ) => {

        new FindPaymentsMethods( this.paymentRepository )
            .execute(  )
            .then( paymentResponse => HandlerResponses.handleSuccess( res , paymentResponse , 200 ))
            .catch( error => { console.log(error); return HandlerResponses.handleError( error , res )});
    }

    public findIdentificationTypes = ( req : Request , res : Response ) => {
        
        new FindIdentificationTypes( this.paymentRepository )
            .execute()
            .then( paymentResponse => HandlerResponses.handleSuccess( res , paymentResponse , 200 ))
            .catch( error => { console.log(error); return HandlerResponses.handleError( error , res )});
    }

    public calculateTotal = ( req : Request , res : Response ) => {

        const { items , code } = req.body;
        if( !items ) return HandlerResponses.handleError( CustomError.badRequest('El carrito no puede estar vació para calcular el total') , res );

        new CalculateTotal( this.courseRepository )
            .execute( items , code )
            .then( paymentResponse => HandlerResponses.handleSuccess( res , paymentResponse , 200 ))
            .catch( error => { console.log(error); return HandlerResponses.handleError( error , res )});
    }

};