import { regularExps } from "./regular.exp";
import { parseNumber } from "./number-parsers";

/**
 * Helpers para validar parámetros opcionales de query string (`req.query`).
 *
 * Cada helper devuelve `undefined` si el parámetro no vino, el valor normalizado si es válido,
 * o lanza `InvalidQueryParamError` con el mensaje indicado. `parseQueryParams` atrapa ese error
 * y lo convierte en la tupla `[ error , undefined ]` que usan los DTOs, así cada campo queda en
 * una sola línea en vez de un bloque let/if.
 */
export class InvalidQueryParamError extends Error { }

const fail = ( message : string ) : never => { throw new InvalidQueryParamError( message ); };

export const optionalId = ( value : unknown , message : string ) : string | undefined => {
    if( value === undefined ) return undefined;
    if( typeof value !== 'string' || !regularExps.isValidId.test( value ) ) return fail( message );
    return value;
}

/** Texto no vacío, devuelto sin espacios en los extremos. */
export const optionalText = ( value : unknown , message : string ) : string | undefined => {
    if( value === undefined ) return undefined;
    if( typeof value !== 'string' || value.trim().length === 0 ) return fail( message );
    return value.trim();
}

/** Número vía `parseNumber`: rechaza '' y lo demás que `Number()`/`isNaN` aceptan por coerción. */
export const optionalNumber = ( value : unknown , message : string ) : number | undefined => {
    if( value === undefined ) return undefined;
    return parseNumber( value ) ?? fail( message );
}

/** Acepta `true`/`false` como booleano o como string (así llegan desde la query). */
export const optionalBoolean = ( value : unknown , message : string ) : boolean | undefined => {
    if( value === undefined ) return undefined;
    if( value === true || value === 'true' ) return true;
    if( value === false || value === 'false' ) return false;
    return fail( message );
}

/** Lanza `InvalidQueryParamError` si `condition` es verdadera. Para reglas entre campos o de rango. */
export const rejectIf = ( condition : boolean , message : string ) : void => {
    if( condition ) fail( message );
}

export const parseQueryParams = <T>( build : () => T ) : [ string? , T? ] => {
    try {
        return [ undefined , build() ];
    }
    catch( error ){
        if( error instanceof InvalidQueryParamError ) return [ error.message , undefined ];
        throw error;
    }
}
