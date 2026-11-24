import { regularExps } from "../../helpers/regular.exp";
import { parseNonNegativeInteger } from "../../helpers/number-parsers";

interface UpdateModuleOptions {
    id         : string,
    title     ?: string,
    unit      ?: number,
}

/**
 * Lo que un update de módulo puede escribir. Esta factory es la única capa de validación:
 * findOneAndUpdate no corre los validadores del schema.
 *
 * Fuera a propósito:
 *  - `id_lessons`: lo construye el $addToSet de ModuleDatasource.addLessonToModule.
 *  - `id_course`: un módulo no se mueve de curso por este endpoint. Antes se leía del body y el
 *    use-case lo pisaba con el curso actual, o sea que nunca cambiaba; ahora directamente no entra.
 *
 * Todos los campos son opcionales (se puede cambiar sólo `unit` para reordenar), pero tiene que
 * venir al menos uno.
 */
export class UpdateModuleDto {

    public readonly id         : string;
    public readonly title     ?: string;
    public readonly unit      ?: number;

    private constructor ( options : UpdateModuleOptions ) {
        const { id , title, unit }  = options;
        this.id = id;
        this.title = title;
        this.unit = unit;
    }

    static create = ( props : { [ key : string ] : any } ) : [ string?, UpdateModuleDto? ]  => {
        const { id , title , unit } = props ?? {};

        if( typeof id !== 'string' || !regularExps.isValidId.test( id ) ) return ['El id del modulo no es válido.', undefined];

        if( title !== undefined ) {
            if( typeof title !== 'string' || title.trim().length === 0 ) return ['El titulo no puede estar vació.', undefined];
            if( title.trim().length < 6 ) return ['El titulo debe contener más de 6 caracteres.', undefined];
        }

        let parsedUnit : number | undefined;
        if( unit !== undefined ) {
            parsedUnit = parseNonNegativeInteger( unit );
            if( parsedUnit === undefined ) return ['La unidad debe ser un entero mayor o igual a 0.', undefined];
        }

        if( title === undefined && unit === undefined ) return ['Debes indicar al menos un campo para actualizar.', undefined];

        return [ undefined , new UpdateModuleDto( { id, title : title?.trim(), unit : parsedUnit } ) ];
    }
}
