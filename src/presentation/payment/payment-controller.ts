import { Request, Response } from "express";

import { PaymentRepository } from "../../domain/repository/payment-repository";
import { HandlerResponses } from "../helpers/handler-responses";
import { CustomError } from "../../domain/errors/custom-error";
import { CreatePayment } from "../../domain/use-cases/payment/create-payment";
import { CourseRepository } from "../../domain/repository";
import { AuthRepository } from '../../domain/repository/auth-repository';
import { FindPaymentsMethods } from "../../domain/use-cases/payment/find-payments-methods";
import { AuthenticatedRequest } from "../middlewares";
import { PaymentCreateDto } from "../../domain/dtos/payment/payment-create.dto";
import { FindIdentificationTypes } from "../../domain/use-cases/payment/find-identification-types";
import { CalculateTotal } from "../../domain/use-cases/payment/calculate-total";


export class PaymentController {

    constructor(
        private readonly paymentRepository : PaymentRepository,
        private readonly courseRepository  : CourseRepository,
        private readonly authRepository    : AuthRepository,
    ){ }

    public createPayment = ( req : AuthenticatedRequest , res : Response ) => {
        const { user } = req;
        if( !user ) throw HandlerResponses.handleError(CustomError.unauthorized('No hay usuario en la petición.') , res );
        console.log(req.body)
        const [ error , paymentRequestDto ] = PaymentCreateDto.create( req.body );
        if( error ) throw HandlerResponses.handleError( CustomError.badRequest(error) , res );
        console.log('a')
        new CreatePayment( this.paymentRepository, this.courseRepository , this.authRepository )
            .execute( paymentRequestDto! , user  )
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