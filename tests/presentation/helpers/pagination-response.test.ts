import { describe, expect, test } from '@jest/globals';

import { CourseFilterDto } from '../../../src/domain/dtos/course/course-filter.dto';
import { PaginationDto } from '../../../src/domain/dtos/shared/pagination.dto';
import { buildPaginationResponse } from '../../../src/presentation/helpers/pagination-response';

const paginationFrom = ( query : Record<string , unknown> ) => PaginationDto.create( query )[1]!;

describe('buildPaginationResponse' , () => {

    test('should compute pages and omit links at the edges' , () => {
        const response = buildPaginationResponse({
            items : [] , total : 5 , pagination : paginationFrom({}) , basePath : '/api/courses',
        });

        expect( response ).toMatchObject({ pages : 1 , current_page : 1 , limit : 10 , total : 5 , next : null , prev : null });
    });

    // Regresión: next/prev sólo llevaban current_page y limit, y la página siguiente era otro listado.
    test('should keep the applied filters in next and prev' , () => {
        const [ , filter ] = CourseFilterDto.create({ title : 'node js' , priceMax : '100' , notFullyEnrolled : 'true' });

        const response = buildPaginationResponse({
            items      : [],
            total      : 30,
            pagination : paginationFrom({ current_page : '2' , limit : '10' }),
            basePath   : '/api/courses',
            filters    : filter,
        });

        expect( response.next ).toBe( '/api/courses?title=node+js&priceMax=100&notFullyEnrolled=true&current_page=3&limit=10' );
        expect( response.prev ).toBe( '/api/courses?title=node+js&priceMax=100&notFullyEnrolled=true&current_page=1&limit=10' );
    });
});
