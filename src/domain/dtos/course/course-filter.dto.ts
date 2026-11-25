import { optionalBoolean, optionalId, optionalNumber, optionalText, parseQueryParams, rejectIf } from "../../helpers/query-parsers";

/**
 * Filtro de intención para la búsqueda de cursos.
 * Representa lo que el cliente pidió, no cómo se consulta la base de datos:
 * la traducción a una query concreta vive en infraestructura.
 *
 * Los nombres de las propiedades coinciden con los de los query params, así los links de
 * paginación pueden reconstruir la query a partir del DTO.
 */
export class CourseFilterDto {

    private constructor(
        public readonly id_category      ?: string,
        public readonly category_name    ?: string,
        public readonly title            ?: string,
        public readonly priceMin         ?: number,
        public readonly priceMax         ?: number,
        public readonly notFullyEnrolled ?: boolean,
    ){ }

    static create = ( props : { [ key : string ] : any } = {} ) : [ string? , CourseFilterDto? ] => {
        return parseQueryParams( () => {
            const id_category      = optionalId( props.id_category , 'El id de la categoría no es válido.' );
            const category_name    = optionalText( props.category_name , 'El nombre de la categoría a buscar no puede estar vacío.' );
            const title            = optionalText( props.title , 'El título a buscar no puede estar vacío.' );
            const priceMin         = optionalNumber( props.priceMin , 'El precio mínimo debe ser un número.' );
            const priceMax         = optionalNumber( props.priceMax , 'El precio máximo debe ser un número.' );
            const notFullyEnrolled = optionalBoolean( props.notFullyEnrolled , 'El filtro notFullyEnrolled debe ser true o false.' );

            rejectIf( priceMin !== undefined && priceMin < 0 , 'El precio mínimo no puede ser negativo.' );
            rejectIf( priceMax !== undefined && priceMax < 0 , 'El precio máximo no puede ser negativo.' );
            rejectIf( priceMin !== undefined && priceMax !== undefined && priceMin > priceMax ,
                      'El precio mínimo no puede ser mayor al precio máximo.' );

            return new CourseFilterDto( id_category , category_name , title , priceMin , priceMax , notFullyEnrolled );
        });
    }
}
