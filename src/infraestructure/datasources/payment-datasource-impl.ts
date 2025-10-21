import { PaymentDataSource } from '../../domain/datasources/payment-datasource';
import { CourseEntity } from '../../domain/entities/course.entity';
import { UserEntity } from '../../domain/entities/user.entity';
import { PaymentService } from '../../domain/services';


export class PaymentDataSourceImpl implements PaymentDataSource {

    constructor( 
        private readonly paymentService : PaymentService
    ) { }

    async createPayment( course : CourseEntity, user : UserEntity ) : Promise<any> {
        throw new Error('Method not implemented.');
    }

    async findPaymentsMethods() : Promise<any> {
        const paymentsMethods = await this.paymentService.findPaymentsMethods();
        console.log(paymentsMethods);
        return paymentsMethods;
    }


}