/**
 * Normaliza un número que llega del body. Acepta number o string numérico ("10", "10.5"),
 * porque un cliente con form-data manda todo como string. Rechaza lo que isNaN deja pasar
 * por coerción ('', '   ', true, [], {}) y los no finitos.
 *
 * Devuelve el número, o undefined si el valor no es un número válido.
 */
export const parseNumber = ( value : unknown ) : number | undefined => {
    if( typeof value === 'number' ) return Number.isFinite( value ) ? value : undefined;
    if( typeof value === 'string' && /^-?\d+(\.\d+)?$/.test( value.trim() ) ) return Number( value.trim() );
    return undefined;
}

export const parseNonNegativeNumber = ( value : unknown ) : number | undefined => {
    const parsed = parseNumber( value );
    return parsed !== undefined && parsed >= 0 ? parsed : undefined;
}

export const parseNonNegativeInteger = ( value : unknown ) : number | undefined => {
    const parsed = parseNonNegativeNumber( value );
    return parsed !== undefined && Number.isInteger( parsed ) ? parsed : undefined;
}
