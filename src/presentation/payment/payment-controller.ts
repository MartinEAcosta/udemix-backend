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


export class PaymentController {

    constructor(
        private readonly paymentRepository : PaymentRepository,
        private readonly courseRepository  : CourseRepository,
        private readonly authRepository    : AuthRepository,
    ){ }

    public createPayment = ( req : AuthenticatedRequest , res : Response ) => {

        const { user } =  req;
        if( !user ) throw HandlerResponses.handleError(CustomError.unauthorized('No hay usuario en la petición.') , res );
    
        const [ error , paymentRequestDto ] = PaymentCreateDto.create( req.body );
        if( error ) throw HandlerResponses.handleError( CustomError.badRequest(error) , res );

        new CreatePayment( this.paymentRepository, this.courseRepository , this.authRepository )
            .execute( paymentRequestDto! , user  )
            .then( paymentResponse => HandlerResponses.handleSuccess( res , paymentResponse , 201 ))
            .catch( error => { console.log(error); return HandlerResponses.handleError( error , res )});
    }

    public findPaymentsMethods = ( req : Request  , res : Response ) => {

        new FindPaymentsMethods( this.paymentRepository )
            .execute(  )
            .then( paymentResponse => HandlerResponses.handleSuccess( res , paymentResponse , 201 ))
            .catch( error => { console.log(error); return HandlerResponses.handleError( error , res )});
    }

};