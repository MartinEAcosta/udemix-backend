import { PaymentEntity } from "../../entities/payment.entity";
import { CustomError } from "../../errors/custom-error";
import { EnrollmentRepository } from "../../repository";
import { OrderRepository } from "../../repository/order-repository";
import { PaymentRepository } from "../../repository/payment-repository";

interface FulfillPaymentUseCase {
    execute ( id_order : string ) : Promise<PaymentEntity>;
}

export class FulfillPayment implements FulfillPaymentUseCase {

    constructor(
        private readonly orderRepository : OrderRepository,
        private readonly paymentRepository : PaymentRepository,
        private readonly enrollmentRepository : EnrollmentRepository,
    ){ }

    async execute ( id_order : string ) : Promise<PaymentEntity> {

        if( !id_order ) throw CustomError.badRequest('Es necesario indicar el id de la orden.');

        const order = await this.orderRepository.findOrderById( id_order );

        const updatedPayment = await this.paymentRepository.updatePaymentByIdPayment(
            {
                id_payment : id_order,
                status : order.status,
            }
        );

        if( order.status === 'processed' ){
            for( let course_id of updatedPayment.id_courses ){
                await this.enrollmentRepository.saveEnrollment(
                    {
                        id_user : updatedPayment.id_user,
                        id_course : course_id,
                    }
                );
            }
        }

        return updatedPayment;
    }
}
