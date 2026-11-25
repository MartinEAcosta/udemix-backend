import { PaginationDto, PaginationResponseDto } from "../../domain/dtos/shared/pagination.dto";

interface BuildPaginationResponseOptions<T> {
    items      : T,
    total      : number,
    pagination : PaginationDto,
    /** Ruta sobre la que se construyen los links next/prev, p. ej. '/api/courses'. */
    basePath   : string,
    /**
     * Filtros aplicados, con los nombres de los query params. Se repiten en next/prev para que
     * la página siguiente sea del mismo listado. Las claves con valor undefined se omiten.
     */
    filters   ?: object,
}

/** Único lugar donde se arma el envoltorio paginado: páginas y links next/prev. */
export const buildPaginationResponse = <T>(
    { items , total , pagination , basePath , filters = {} } : BuildPaginationResponseOptions<T>
) : PaginationResponseDto<T> => {

    const { current_page , limit } = pagination;
    const pages = Math.ceil( total / limit );

    const filterEntries = Object.entries( filters )
                                .filter( ([ , value ]) => value !== undefined && value !== null )
                                .map( ([ key , value ]) => [ key , String( value ) ] );

    const linkTo = ( page : number ) => {
        const params = new URLSearchParams( filterEntries );
        params.set( 'current_page' , String( page ) );
        params.set( 'limit' , String( limit ) );
        return `${ basePath }?${ params.toString() }`;
    };

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
