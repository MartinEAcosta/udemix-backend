import { Request, Response } from "express";

import { OrderRepository } from "../../domain/repository/order-repository";
import { AuthRepository } from "../../domain/repository/auth-repository";
import { CreateOrder } from "../../domain/use-cases/order/create-order";
import { FindOrderById } from "../../domain/use-cases/order/find-order-by-id";
import { FulfillPayment } from "../../domain/use-cases/payment/fulfill-payment";
import { OrderRequestAdapterDto } from "../../domain/dtos/order/order-request-adapter.dto";
import { WebhookPayload } from "../../domain/dtos/payment/payment.response";
import { CustomError } from "../../domain/errors/custom-error";
import { HandlerResponses } from "../helpers/handler-responses";
import { AuthenticatedRequest } from "../middlewares";
import { PaymentRepository } from "../../domain/repository/payment-repository";
import { CourseRepository } from '../../domain/repository/course-repository';
import { EnrollmentRepository } from "../../domain/repository";

export class OrderController {

    constructor(
        private readonly orderRepository : OrderRepository,
        private readonly paymentRepository : PaymentRepository,
        private readonly courseRepository : CourseRepository,
        private readonly enrollmentRepository : EnrollmentRepository,
        private readonly authRepository  : AuthRepository,
    ) { }

    public webhookHandler = ( req : Request , res : Response ) => {

        const { action , data } : WebhookPayload = req.body;

        if( action.includes('order') ) {
            new FulfillPayment( this.orderRepository , this.paymentRepository , this.enrollmentRepository )
                .execute( data.id.toString() )
                .then( () => {} )
                .catch( error => console.log(error) );
        }

        return HandlerResponses.handleSuccess( res , 'Se recibio la notificación correctamente', 200);
    }

    public createOrder = ( req : AuthenticatedRequest , res : Response ) => {
        const { user } = req;
        if( !user ) return HandlerResponses.handleError( CustomError.unauthorized('No hay usuario en la petición.') , res );

        const [ error , orderRequestDto ] = OrderRequestAdapterDto.create( req.body );
        if( error ) return HandlerResponses.handleError( CustomError.badRequest(error) , res );

        new CreateOrder( this.orderRepository , this.paymentRepository , this.courseRepository, this.enrollmentRepository, this.authRepository )
            .execute( orderRequestDto! , user )
            .then( orderResult => HandlerResponses.handleSuccess( res , orderResult , 201 ))
            .catch( error => HandlerResponses.handleError( error , res ));
    }

    public findOrderById = ( req : Request , res : Response ) => {
        if( typeof req.params.id !== 'string' || !req.params.id ) return HandlerResponses.handleError( CustomError.badRequest('Debes indicar un id valido.') , res );
        const { id } = req.params;

        new FindOrderById( this.orderRepository )
            .execute( id )
            .then( orderResult => HandlerResponses.handleSuccess( res , orderResult , 200 ))
            .catch( error => HandlerResponses.handleError( error , res ));
    }

};
