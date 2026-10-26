import { ItemQuantity } from "../../dtos/payment/payment.response";
import { CustomError } from "../../errors/custom-error";
import { CourseRepository } from "../../repository";

interface CalculateTotalUseCase {
    execute( items : ItemQuantity[] , code ?: string ) : Promise<number>;
}

export class CalculateTotal implements CalculateTotalUseCase {
    
    constructor(
        private readonly courseRepository : CourseRepository,
    ) { }


    async execute( items : ItemQuantity[] ) : Promise<number> {
        console.log(items)

        let total = 0;
        for( let item of items ){
            const course = await this.courseRepository.findCourseById( item.id_course );
            if( !course ) throw CustomError.notFound('No se puede calcular el total del carrito, debido a que no se encontro uno de los articulos.');
            total += +course.price * item.quantity;
        }

  
        return total;
    }

}