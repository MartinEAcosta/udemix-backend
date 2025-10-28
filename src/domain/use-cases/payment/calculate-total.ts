import { CartItem } from "../../dtos/payment/payment.response";
import { CustomError } from "../../errors/custom-error";
import { CourseRepository } from "../../repository";

interface CalculateTotalUseCase {
    execute( items : CartItem[] , code ?: string ) : Promise<any>;
}

export class CalculateTotal implements CalculateTotalUseCase {
    
    constructor(
        private readonly courseRepository : CourseRepository,
    ) { }


    async execute( items : CartItem[] , code ?: string ) : Promise<any> {

        let total = 0;
        for( let item of items ){
            const course = await this.courseRepository.findCourseById( item.course.id );
            if( !course ) throw CustomError.notFound('No se puede calcular el total del carrito, debido a que no se encontro uno de los articulos.');
            total += +course.price * item.quantity;
        }

        if( code ){
            // Chequear que exista el código, si esta dentro del tiempo valido designado
            // total = total * (1-code)
        }
        return total;
    }

}