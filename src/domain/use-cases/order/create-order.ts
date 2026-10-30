import { OrderRequestAdapterDto } from "../../dtos/order/order-request-adapter.dto";
import { PaymentRequestDTO } from "../../dtos/payment/payment-request.dto";
import { OrderGatewayResult } from "../../dtos/payment/payment.response";
import { UserEntity } from "../../entities/user.entity";
import { CustomError } from "../../errors/custom-error";
import { AuthRepository, CourseRepository, EnrollmentRepository } from "../../repository";
import { OrderRepository } from "../../repository/order-repository";
import { PaymentRepository } from "../../repository/payment-repository";

interface CreateOrderUseCase {
    execute( orderRequestDto : OrderRequestAdapterDto , user : UserEntity ) : Promise<OrderGatewayResult>;
}

export class CreateOrder implements CreateOrderUseCase {

    constructor(
        private readonly orderRepository : OrderRepository,
        private readonly paymentRepository : PaymentRepository,
        private readonly courseRepository : CourseRepository,
        private readonly enrollmentRepository : EnrollmentRepository,
        private readonly authRepository  : AuthRepository,
    ) { }

    async execute( orderRequestDto : OrderRequestAdapterDto , user : UserEntity ) : Promise<OrderGatewayResult> {
        console.log( user.id )
        const userLogged = await this.authRepository.findUserById( user.id );
        if( !userLogged ) throw CustomError.badRequest('No puedes generar una orden sin un usuario vinculado.');

        let total_amount = 0;
        let coursesToBuy = []
        for( let item of orderRequestDto.items ){
            const course = await this.courseRepository.findCourseById( item.id_course! );
            if( !course ) throw CustomError.notFound('No se ha encontrado un curso del carrito.');
            if( course.spots_remaining === 0 ){
                throw CustomError.badRequest( `El curso "${ course.title }" no tiene cupos disponibles.` );
            }
            total_amount += course.price;
            coursesToBuy.push( course.id );
        }

        const [ paymentError, paymentRequestDto ] = PaymentRequestDTO.create({
            id_user : userLogged.id.toString(),
            id_courses : coursesToBuy,
            amount : total_amount,
            date : new Date(),
            status : 'pending',
            id_payment : null,
        });
        if( paymentError ) throw CustomError.badRequest( paymentError );

        const createdPayment = await this.paymentRepository.createPayment( paymentRequestDto! );

        const orderRequestWithServerData = orderRequestDto.withServerComputedData(
            createdPayment.id,
            createdPayment.amount.toFixed(2),
        );

        const gatewayResponse = await this.orderRepository.createOrder( orderRequestWithServerData );
        console.log(gatewayResponse)
        if( gatewayResponse.status === 'processed'){
            let enroll;
            for( let course_id of coursesToBuy ){
                enroll = await this.enrollmentRepository.saveEnrollment(
                    {
                        id_user : userLogged.id,
                        id_course : course_id,
                    }
                );
                if( !enroll ) throw CustomError.internalServer('Hubo un error al generar la inscripción.')
                console.log(enroll)       
            }
        }

        return await this.paymentRepository.updatePayment(
            {
                id : createdPayment.id,
                id_payment : gatewayResponse.id,
                status : gatewayResponse.status,
                date : new Date(),
            }
        );
    }

}
