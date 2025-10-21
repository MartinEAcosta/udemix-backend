import { CourseEntity } from "../entities/course.entity";
import { UserEntity } from "../entities/user.entity";

export abstract class PaymentDataSource {

    abstract createPayment( course : CourseEntity , user : UserEntity ) : Promise<any>;
    abstract findPaymentsMethods( ) : Promise<any>;
    
}
