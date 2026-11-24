import { describe, expect, test } from '@jest/globals';

import { CourseFilterDto } from '../../../src/domain/dtos/course/course-filter.dto';

describe('CourseFilterDto.create' , () => {

    test('should return an empty filter when there are no query params' , () => {
        const [ error , filter ] = CourseFilterDto.create({});

        expect( error ).toBeUndefined();
        expect( filter ).toBeInstanceOf( CourseFilterDto );
        expect( Object.values( filter! ).every( value => value === undefined ) ).toBe( true );
    });

    test('should parse and normalize every supported param' , () => {
        const [ error , filter ] = CourseFilterDto.create({
            id_category      : '64b7f0c2a1b2c3d4e5f60718',
            category_name    : '  Programación ',
            title            : ' node ',
            priceMin         : '10',
            priceMax         : '99.5',
            notFullyEnrolled : 'true',
        });

        expect( error ).toBeUndefined();
        expect( filter ).toMatchObject({
            id_category      : '64b7f0c2a1b2c3d4e5f60718',
            category_name    : 'Programación',
            title            : 'node',
            priceMin         : 10,
            priceMax         : 99.5,
            notFullyEnrolled : true,
        });
    });

    // Regresión: Number('') === 0, así que ?priceMax= filtraba sólo cursos gratis.
    test.each([
        [ { priceMax : '' } , 'El precio máximo debe ser un número.' ],
        [ { priceMin : '' } , 'El precio mínimo debe ser un número.' ],
        [ { priceMin : 'abc' } , 'El precio mínimo debe ser un número.' ],
        [ { priceMin : '-1' } , 'El precio mínimo no puede ser negativo.' ],
        [ { priceMax : '-1' } , 'El precio máximo no puede ser negativo.' ],
        [ { priceMin : '50' , priceMax : '10' } , 'El precio mínimo no puede ser mayor al precio máximo.' ],
        [ { id_category : 'no-es-un-id' } , 'El id de la categoría no es válido.' ],
        [ { category_name : '   ' } , 'El nombre de la categoría a buscar no puede estar vacío.' ],
        [ { title : '' } , 'El título a buscar no puede estar vacío.' ],
        [ { title : [ 'a' , 'b' ] } , 'El título a buscar no puede estar vacío.' ],
        [ { notFullyEnrolled : 'yes' } , 'El filtro notFullyEnrolled debe ser true o false.' ],
        [ { notFullyEnrolled : [ 'true' ] } , 'El filtro notFullyEnrolled debe ser true o false.' ],
    ])('should reject %j' , ( query , message ) => {
        const [ error , filter ] = CourseFilterDto.create( query );

        expect( error ).toBe( message );
        expect( filter ).toBeUndefined();
    });
});
