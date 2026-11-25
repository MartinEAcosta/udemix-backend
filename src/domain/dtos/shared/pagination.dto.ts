import { parseNonNegativeInteger } from "../../helpers/number-parsers";

export interface PaginationResponseDto<T> {
    pages         : number,
    current_page  : number,
    limit         : number,
    total         : number,
    next          : string | null,
    prev          : string | null,
    items         : T,
}

/** Lo que devuelven datasources y repositorios: la página cruda, sin envoltorio HTTP. */
export interface PaginatedResult<T> {
    items : T,
    total : number,
}

export const DEFAULT_PAGE  = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT     = 100;

export class PaginationDto {

    private constructor (
        public readonly current_page  : number,
        public readonly limit : number,
    ){ }

    /** Cantidad de documentos a saltear para llegar a la página actual. */
    get skip() : number {
        return ( this.current_page - 1 ) * this.limit;
    }

    /**
     * Recibe la query cruda (`req.query`). Ausente = default; presente = entero, porque Mongo
     * no acepta decimales en $skip/$limit.
     */
    static create( props : { [ key : string ] : any } = {} ) : [string? , PaginationDto?] {
        const { current_page = DEFAULT_PAGE , limit = DEFAULT_LIMIT } = props;

        const parsedPage  = parseNonNegativeInteger( current_page );
        const parsedLimit = parseNonNegativeInteger( limit );
        if( parsedPage === undefined || parsedLimit === undefined ) return ['La página y el límite deben ser números enteros.', undefined];

        if( parsedPage <= 0 ) return ['La página debe ser mayor a 0.', undefined];
        if( parsedLimit <= 0 || parsedLimit > MAX_LIMIT ) return [`El límite debe estar entre 1 y ${ MAX_LIMIT }.`, undefined];

        return [undefined , new PaginationDto( parsedPage , parsedLimit )];
    }
}
