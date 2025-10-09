
export interface PaginationResponseDto<T> {
    page  : number,
    limit : number,
    total : number,
    next  : string | null,
    prev  : string | null,
    items : T,
}

export class PaginationDto {

    private constructor (
        public readonly page  : number,
        public readonly limit : number,
    ){ }

    static create( page : number = 1 , limit : number = 10) : [string? , PaginationDto?] {
        if( isNaN(page) || isNaN(limit) ) return ['La página y los limites, deben ser numeros.', undefined];
        
        if( page <= 0 ) return ['La página debe ser mayor a 0.', undefined];
        if( limit <= 0 ) return ['El limite debe ser mayor a 0.', undefined];

        return [undefined , new PaginationDto( page , limit )];
    }
}