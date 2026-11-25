import { describe, expect, test } from '@jest/globals';

import { PaginationDto } from '../../../src/domain/dtos/shared/pagination.dto';

describe('PaginationDto.create' , () => {

    test('should default to page 1 and limit 10' , () => {
        const [ error , pagination ] = PaginationDto.create({});

        expect( error ).toBeUndefined();
        expect( pagination ).toMatchObject({ current_page : 1 , limit : 10 });
        expect( pagination!.skip ).toBe( 0 );
    });

    test('should parse string params and compute skip' , () => {
        const [ error , pagination ] = PaginationDto.create({ current_page : '3' , limit : '20' });

        expect( error ).toBeUndefined();
        expect( pagination ).toMatchObject({ current_page : 3 , limit : 20 });
        expect( pagination!.skip ).toBe( 40 );
    });

    test('should accept the max limit of 100' , () => {
        const [ error ] = PaginationDto.create({ limit : '100' });

        expect( error ).toBeUndefined();
    });

    // Regresión: +'10.5' pasaba la validación y Mongo rechazaba el $skip/$limit decimal (500).
    test.each([
        [ { limit : '10.5' } , 'La página y el límite deben ser números enteros.' ],
        [ { limit : '' } , 'La página y el límite deben ser números enteros.' ],
        [ { current_page : 'abc' } , 'La página y el límite deben ser números enteros.' ],
        [ { current_page : '-1' } , 'La página y el límite deben ser números enteros.' ],
        [ { current_page : '0' } , 'La página debe ser mayor a 0.' ],
        [ { limit : '0' } , 'El límite debe estar entre 1 y 100.' ],
        [ { limit : '101' } , 'El límite debe estar entre 1 y 100.' ],
    ])('should reject %j' , ( query , message ) => {
        const [ error , pagination ] = PaginationDto.create( query );

        expect( error ).toBe( message );
        expect( pagination ).toBeUndefined();
    });
});
