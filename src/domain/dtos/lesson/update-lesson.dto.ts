import { regularExps } from "../../helpers/regular.exp";
import { parseNonNegativeInteger } from "../../helpers/number-parsers";

interface UpdateLessonDtoOptions {
    id             : string;
    title         ?: string;
    description   ?: string;
    lesson_number ?: number;
}

/**
 * Lo que un update de lección puede escribir. Esta factory es la única capa de validación:
 * findByIdAndUpdate no corre los validadores del schema.
 *
 * Fuera a propósito:
 *  - `id_module`: antes se leía del body y UpdateLesson sólo verificaba la propiedad de la lección,
 *    no la del módulo destino, así que un docente podía colgar su lección de un módulo ajeno (y el
 *    id_lessons de ningún módulo se actualizaba). Mover lecciones entre módulos necesita su propio
 *    flujo transaccional.
 *  - `id_file`: lo escribe sólo LessonDatasource.setLessonFile.
 */
export class UpdateLessonDto {

    public readonly id            : string;
    public readonly title         ?: string;
    public readonly description   ?: string;
    public readonly lesson_number ?: number;

    private constructor( options : UpdateLessonDtoOptions ) {
        this.id            = options.id;
        this.title         = options.title;
        this.description   = options.description;
        this.lesson_number = options.lesson_number;
    }

    static create = ( props : { [ key : string ] : any } ) : [ string?, UpdateLessonDto? ]  => {
        const { id , title , description , lesson_number } = props ?? {};

        if( typeof id !== 'string' || !regularExps.isValidId.test( id ) ) return ['El id de la lección por actualizar no es válido.' , undefined];

        if( title !== undefined && ( typeof title !== 'string' || title.trim().length === 0 ) ) {
            return [ 'El titulo de la lección no puede estar vacío.' , undefined];
        }
        if( description !== undefined && ( typeof description !== 'string' || description.trim().length === 0 ) ) {
            return [ 'La descripción de la lección no puede estar vacía.' , undefined];
        }

        let parsedLessonNumber : number | undefined;
        if( lesson_number !== undefined ) {
            parsedLessonNumber = parseNonNegativeInteger( lesson_number );
            if( parsedLessonNumber === undefined ) return [ 'El número de lección debe ser un entero mayor o igual a 0.' , undefined];
        }

        if( [ title , description , lesson_number ].every( value => value === undefined ) ) {
            return [ 'Debes indicar al menos un campo para actualizar.' , undefined];
        }

        return [ undefined , new UpdateLessonDto({
                                                id ,
                                                title : title?.trim(),
                                                description : description?.trim(),
                                                lesson_number : parsedLessonNumber,
                                            } )];
    }

}
