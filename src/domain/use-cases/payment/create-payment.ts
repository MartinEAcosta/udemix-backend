import { CourseRepository } from "../../repository";
import { PaymentRepository } from "../../repository/payment-repository";

interface CreatePaymentUseCase {
    execute( id_courses : string[] , id_user : string ) : Promise<any>;
}

export class CreatePayment implements CreatePaymentUseCase {

    constructor(
        private readonly paymentRepository : PaymentRepository,
        private readonly courseRepository  : CourseRepository,
    ) { }

    async execute( id_courses : string[] , id_user : string ) : Promise<any> {

        const courses = await this.courseRepository.findCoursesByIds( id_courses );

        
    }

}