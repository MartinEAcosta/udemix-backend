import { regularExps } from "../../helpers/regular.exp";

/**
 * Filtro de intención para la búsqueda de cursos.
 * Representa lo que el cliente pidió, no cómo se consulta la base de datos:
 * la traducción a una query concreta vive en infraestructura.
 */
export class CourseFilterDto {

    private constructor(
        public readonly id_category      ?: string,
        public readonly title            ?: string,
        public readonly priceMin         ?: number,
        public readonly priceMax         ?: number,
        public readonly notFullyEnrolled ?: boolean,
    ){ }

    static create = ( props : { [ key : string ] : any } = {} ) : [ string? , CourseFilterDto? ] => {
        const { id_category , title , priceMin , priceMax , notFullyEnrolled } = props;

        let parsedIdCategory : string | undefined = undefined;
        if( id_category !== undefined ){
            if( typeof id_category !== 'string' || !regularExps.isValidId.test( id_category ) ){
                return [ 'El id de la categoría no es válido.' , undefined ];
            }
            parsedIdCategory = id_category;
        }

        let parsedTitle : string | undefined = undefined;
        if( title !== undefined ){
            if( typeof title !== 'string' || title.trim().length === 0 ){
                return [ 'El título a buscar no puede estar vacío.' , undefined ];
            }
            parsedTitle = title.trim();
        }

        let parsedPriceMin : number | undefined = undefined;
        if( priceMin !== undefined ){
            parsedPriceMin = Number( priceMin );
            if( isNaN( parsedPriceMin ) ) return [ 'El precio mínimo debe ser un número.' , undefined ];
            if( parsedPriceMin < 0 ) return [ 'El precio mínimo no puede ser negativo.' , undefined ];
        }

        let parsedPriceMax : number | undefined = undefined;
        if( priceMax !== undefined ){
            parsedPriceMax = Number( priceMax );
            if( isNaN( parsedPriceMax ) ) return [ 'El precio máximo debe ser un número.' , undefined ];
            if( parsedPriceMax < 0 ) return [ 'El precio máximo no puede ser negativo.' , undefined ];
        }

        if( parsedPriceMin !== undefined && parsedPriceMax !== undefined && parsedPriceMin > parsedPriceMax ){
            return [ 'El precio mínimo no puede ser mayor al precio máximo.' , undefined ];
        }

        let parsedNotFullyEnrolled : boolean | undefined = undefined;
        if( notFullyEnrolled !== undefined ){
            const raw = String( notFullyEnrolled );
            if( raw !== 'true' && raw !== 'false' ){
                return [ 'El filtro notFullyEnrolled debe ser true o false.' , undefined ];
            }
            parsedNotFullyEnrolled = raw === 'true';
        }

        return [ undefined , new CourseFilterDto(
                                    parsedIdCategory,
                                    parsedTitle,
                                    parsedPriceMin,
                                    parsedPriceMax,
                                    parsedNotFullyEnrolled,
                                )
        ];
    }
}
