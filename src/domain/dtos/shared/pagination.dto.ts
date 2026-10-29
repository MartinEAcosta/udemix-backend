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

export class PaginationDto {

    private constructor (
        public readonly current_page  : number,
        public readonly limit : number,
    ){ }

    static create( current_page : number = 1 , limit : number = 10 ) : [string? , PaginationDto?] {
        if( isNaN(current_page) || isNaN(limit) ) return ['La página y los limites, deben ser numeros.', undefined];
        
        if( current_page <= 0 ) return ['La página debe ser mayor a 0.', undefined];
        if( limit <= 0 || limit > 100) return ['El limite debe ser mayor a 0 y menor a 100.', undefined];

        return [undefined , new PaginationDto( current_page , limit )];
    }
}

interface BuildPaginationResponseOptions<T> {
    items      : T,
    total      : number,
    pagination : PaginationDto,
    /** Ruta sobre la que se construyen los links next/prev, p. ej. '/api/courses'. */
    basePath   : string,
}

/** Único lugar donde se arma el envoltorio paginado: páginas y links next/prev. */
export const buildPaginationResponse = <T>(
    { items , total , pagination , basePath } : BuildPaginationResponseOptions<T>
) : PaginationResponseDto<T> => {

    const { current_page , limit } = pagination;
    const pages = Math.ceil( total / limit );

    const linkTo = ( page : number ) => `${ basePath }?current_page=${ page }&limit=${ limit }`;

    return {
        pages,
        current_page,
        limit,
        total,
        next  : current_page < pages ? linkTo( current_page + 1 ) : null,
        prev  : current_page > 1     ? linkTo( current_page - 1 ) : null,
        items,
    };
};
