import { describe, expect, test } from '@jest/globals';
import { Types } from 'mongoose';

import { CourseFilterDto } from '../../../src/domain/dtos/course/course-filter.dto';
import { buildCourseQuery } from '../../../src/infraestructure/helpers/course-query-builder';

const filterFrom = ( query : Record<string , unknown> ) => {
    const [ error , filter ] = CourseFilterDto.create( query );
    expect( error ).toBeUndefined();
    return filter!;
}

describe('buildCourseQuery' , () => {

    test('should return an empty query for an empty filter' , () => {
        expect( buildCourseQuery( filterFrom({}) ) ).toEqual({});
    });

    test('should cast id_category to ObjectId (aggregate does not auto-cast)' , () => {
        const query = buildCourseQuery( filterFrom({ id_category : '64b7f0c2a1b2c3d4e5f60718' }) );

        expect( query.id_category ).toBeInstanceOf( Types.ObjectId );
        expect( query.id_category.toString() ).toBe( '64b7f0c2a1b2c3d4e5f60718' );
    });

    test('should match category_name exactly, case-insensitive and escaped' , () => {
        const query = buildCourseQuery( filterFrom({ category_name : 'C++ (avanzado)' }) );

        expect( query.category_name ).toEqual({ $regex : '^C\\+\\+ \\(avanzado\\)$' , $options : 'i' });

        const regex = new RegExp( query.category_name.$regex , query.category_name.$options );
        expect( regex.test( 'c++ (Avanzado)' ) ).toBe( true );
        expect( regex.test( 'C++ (avanzado) II' ) ).toBe( false );
    });

    test('should match title as an escaped, case-insensitive substring' , () => {
        const query = buildCourseQuery( filterFrom({ title : 'node.js' }) );

        expect( query.title ).toEqual({ $regex : 'node\\.js' , $options : 'i' });
    });

    test.each([
        [ { priceMin : '10' } , { $gte : 10 } ],
        [ { priceMax : '50' } , { $lte : 50 } ],
        [ { priceMin : '0' , priceMax : '50' } , { $gte : 0 , $lte : 50 } ],
    ])('should build the price range for %j' , ( query , expected ) => {
        expect( buildCourseQuery( filterFrom( query ) ).price ).toEqual( expected );
    });

    test('should only add the capacity condition when notFullyEnrolled is true' , () => {
        expect( buildCourseQuery( filterFrom({ notFullyEnrolled : 'false' }) ).$or ).toBeUndefined();
        expect( buildCourseQuery( filterFrom({ notFullyEnrolled : 'true' }) ).$or ).toHaveLength( 3 );
    });
});
