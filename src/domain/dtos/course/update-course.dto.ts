import { regularExps } from "../../helpers/regular.exp";
import { parseNonNegativeInteger, parseNonNegativeNumber } from "../../helpers/number-parsers";

/**
 * Lo que un update de curso puede escribir.
 *
 * Esta factory es la ÚNICA capa de validación del update: findByIdAndUpdate no corre los
 * validadores del schema (required, min, enum), así que lo que pase de acá se persiste tal cual.
 *
 * Reglas:
 *  - undefined = "no tocar" (Mongoose descarta las claves undefined del $set).
 *  - null sólo es válido para `capacity` (curso sin límite). En cualquier otro campo borraría
 *    un valor requerido, así que se rechaza.
 *  - `category_name` NO se lee del body: la copia desnormalizada la estampa el use-case vía
 *    withCategoryName, a partir de la categoría que validó.
 *  - Al menos un campo editable tiene que venir; un update vacío es un 400, no un 200 mudo.
 */
export class UpdateCourseDto {

    private constructor(
        public readonly id : string,
        public readonly price ?: number,
        public readonly capacity ?: number | null,
        public readonly title ?: string,
        public readonly description ?: string,
        public readonly id_category ?: string,
        public readonly category_name ?: string,
    ){}

    static create = ( id : string, props: { [ key:string ] : any } ) : [ string? , UpdateCourseDto? ] => {
        const { title, description, id_category, price, capacity } = props ?? {};

        if( typeof id !== 'string' || !regularExps.isValidId.test( id ) ) {
            return [ 'El id del curso no es válido.' , undefined ];
        }

        if( title !== undefined ) {
            if( typeof title !== 'string' || title.trim().length === 0 ) return [ 'El titulo no puede estar vacío.' , undefined ];
        }
        if( description !== undefined ) {
            if( typeof description !== 'string' || description.trim().length === 0 ) return [ 'La descripción no puede estar vacía.' , undefined ];
        }
        if( id_category !== undefined ) {
            if( typeof id_category !== 'string' || !regularExps.isValidId.test( id_category ) ) return [ 'La categoría no es válida.' , undefined ];
        }
        let parsedPrice : number | undefined;
        if( price !== undefined ) {
            parsedPrice = parseNonNegativeNumber( price );
            if( parsedPrice === undefined ) return [ 'El precio debe ser un número mayor o igual a 0.' , undefined ];
        }
        let parsedCapacity : number | null | undefined = capacity === null ? null : undefined;
        if( capacity !== undefined && capacity !== null ) {
            parsedCapacity = parseNonNegativeInteger( capacity );
            if( parsedCapacity === undefined ) return [ 'La capacidad debe ser un entero mayor o igual a 0, o nulo.' , undefined ];
        }

        const nothingToUpdate = [ title, description, id_category, price, capacity ].every( value => value === undefined );
        if( nothingToUpdate ) return [ 'Debes indicar al menos un campo para actualizar.' , undefined ];

        return [ undefined, new UpdateCourseDto(
                                                id,
                                                parsedPrice,
                                                parsedCapacity,
                                                title?.trim(),
                                                description?.trim(),
                                                id_category,
                                                undefined,
                                            )
                ];
    }

    /**
     * Uso interno (UpdateCourse): estampa el nombre de la categoría que el use-case ya validó.
     */
    static withCategoryName = ( base : UpdateCourseDto , category_name : string ) : UpdateCourseDto => {
        if( typeof category_name !== 'string' || category_name.trim().length === 0 ) {
            throw new Error('withCategoryName exige un nombre de categoría no vacío.');
        }
        return new UpdateCourseDto(
            base.id,
            base.price,
            base.capacity,
            base.title,
            base.description,
            base.id_category,
            category_name,
        );
    }
}
