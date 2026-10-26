import { Request, Response } from "express";

import { PaymentRepository } from "../../domain/repository/payment-repository";
import { HandlerResponses } from "../helpers/handler-responses";
import { CustomError } from "../../domain/errors/custom-error";
import { CourseRepository } from "../../domain/repository";
import { FindPaymentsMethods } from "../../domain/use-cases/payment/find-payments-methods";
import { FindIdentificationTypes } from "../../domain/use-cases/payment/find-identification-types";
import { CalculateTotal } from "../../domain/use-cases/payment/calculate-total";


export class PaymentController {

    constructor(
        private readonly paymentRepository : PaymentRepository,
        private readonly courseRepository  : CourseRepository,
    ){ }

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
        const { items } = req.body;
        if( !items ) return HandlerResponses.handleError( CustomError.badRequest('El carrito no puede estar vació para calcular el total') , res );

        new CalculateTotal( this.courseRepository )
            .execute( items )
            .then( paymentResponse => HandlerResponses.handleSuccess( res , paymentResponse , 200 ))
            .catch( error => { console.log(error); return HandlerResponses.handleError( error , res )});
    }

};