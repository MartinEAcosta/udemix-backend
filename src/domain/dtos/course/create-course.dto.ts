import { regularExps } from "../../helpers/regular.exp";
import { parseNonNegativeInteger, parseNonNegativeNumber } from "../../helpers/number-parsers";

/**
 * Campos que NO se leen del body:
 *  - `id_file` / `thumbnail_url`: la portada se asigna sólo por /api/file (SetCourseThumbnailDto),
 *    así un cliente no puede apuntar el FK al File de otro ni inventar una URL.
 *  - `category_name`: lo estampa SaveCourse desde la categoría validada.
 *  - `id_owner` sí se lee, pero lo pisa AuthMiddleware.validateAndAssignOwner con el usuario autenticado.
 */
export class CreateCourseDto {

    private constructor(
        public readonly title : string,
        public readonly description : string,
        public readonly id_category : string,
        public readonly category_name : string,
        public readonly id_file : string | null,
        public readonly thumbnail_url : string | null,
        public readonly id_owner : string,
        public readonly price : number,
        public readonly capacity ?: number | null,
    ){}

    // Retornaria un array con el error en caso de que haya y el dto undefined.
    // en caso de no haber error retorna undefined y el dto instanciandolo via el constructor
    static create = ( props : { [ key : string ] : any } ) : [ string?, CreateCourseDto? ]  => {
        const { title , description , id_category , id_owner , price , capacity } = props ?? {};

        if( typeof title !== 'string' || title.trim().length === 0 ) return ['El titulo es requerido.', undefined];
        if( typeof description !== 'string' || description.trim().length === 0 ) return ['La descripción es requerida.', undefined];
        if( !id_owner ) return ['El creador del curso es requerido.', undefined];
        if( typeof id_category !== 'string' || !regularExps.isValidId.test( id_category ) ) return ['La categoría es requerida y debe ser válida.', undefined];

        const parsedPrice = parseNonNegativeNumber( price );
        if( parsedPrice === undefined ) return ['El precio es requerido y debe ser un número mayor o igual a 0.', undefined];

        let parsedCapacity : number | null | undefined = capacity === null ? null : undefined;
        if( capacity !== undefined && capacity !== null ){
            parsedCapacity = parseNonNegativeInteger( capacity );
            if( parsedCapacity === undefined ) return ['La capacidad debe ser un entero mayor o igual a 0, o nulo.', undefined];
        }

        return [undefined , new CreateCourseDto( 
                                                title.trim() ,
                                                description.trim() ,
                                                id_category ,
                                                '' ,
                                                null , 
                                                null ,
                                                id_owner , 
                                                parsedPrice ,
                                                parsedCapacity
                                            )];
    }   
    
}
