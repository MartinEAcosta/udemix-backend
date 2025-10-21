import { Request, Response } from "express";

import { PaymentRepository } from "../../domain/repository/payment-repository";
import { HandlerResponses } from "../helpers/handler-responses";
import { CustomError } from "../../domain/errors/custom-error";
import { CreatePayment } from "../../domain/use-cases/payment/create-payment";
import { CourseRepository } from "../../domain/repository";
import { AuthRepository } from '../../domain/repository/auth-repository';
import { FindPaymentsMethods } from "../../domain/use-cases/payment/find-payments-methods";


export class PaymentController {

    constructor(
        private readonly paymentRepository : PaymentRepository,
        private readonly courseRepository  : CourseRepository,
        private readonly authRepository    : AuthRepository,
    ){ }

    public createPayment = ( req : Request , res : Response ) => {

        const { id_courses , id_user } = req.body;
        if( !id_courses || !id_user ) throw HandlerResponses.handleError( CustomError.badRequest('Chequee el id del curso o usuario y vuelva a intentarlo') , res );

        new CreatePayment( this.paymentRepository, this.courseRepository , this.authRepository )
            .execute( id_courses , id_user )
            .then( paymentResponse => HandlerResponses.handleSuccess( res , paymentResponse , 201 ))
            .catch( error => { console.log(error); return HandlerResponses.handleError( error , res )});
    }

    public findPaymentsMethods = ( req : Request , res : Response ) => {
        new FindPaymentsMethods( this.paymentRepository )
            .execute( )
            .then( paymentResponse => HandlerResponses.handleSuccess( res , paymentResponse , 201 ))
            .catch( error => { console.log(error); return HandlerResponses.handleError( error , res )});
    }

};