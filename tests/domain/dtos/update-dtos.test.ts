import { describe, expect, test } from '@jest/globals';
import { Types } from 'mongoose';
import { UpdateCourseDto } from '../../../src/domain/dtos/course/update-course.dto';
import { CreateCourseDto } from '../../../src/domain/dtos/course/create-course.dto';
import { UpdateModuleDto } from '../../../src/domain/dtos/module/update-module.dto';
import { UpdateLessonDto } from '../../../src/domain/dtos/lesson/update-lesson.dto';
import { PaymentUpdateDto } from '../../../src/domain/dtos/payment/payment-update.dto';
import { UpdateUserDto } from '../../../src/domain/dtos/auth/update-user-dto';

const oid = () => new Types.ObjectId().toString();

describe('UpdateCourseDto.create' , () => {

    test('rejects an id that is not an ObjectId (antes: CastError -> 500)' , () => {
        const [ error ] = UpdateCourseDto.create( 'abc' , { title : 'Nuevo' });
        expect( error ).toBe('El id del curso no es válido.');
    });

    test('rejects an empty update instead of answering 200 with nothing changed' , () => {
        const [ error ] = UpdateCourseDto.create( oid() , {});
        expect( error ).toBe('Debes indicar al menos un campo para actualizar.');
    });

    test('never reads category_name from the body' , () => {
        const [ error , dto ] = UpdateCourseDto.create( oid() , { title : 'Nuevo' , category_name : 'Falsa' });
        expect( error ).toBeUndefined();
        expect( dto!.category_name ).toBeUndefined();
    });

    test.each([ 'title' , 'description' , 'price' , 'id_category' ])( 'rejects %s: null (borraría un campo requerido)' , ( field ) => {
        const [ error , dto ] = UpdateCourseDto.create( oid() , { [ field ] : null });
        expect( error ).toBeDefined();
        expect( dto ).toBeUndefined();
    });

    test.each([ '' , '   ' , true , [] , {} , -5 , 2.5 , 'muchos' , NaN , Infinity ])( 'rejects capacity: %p' , ( capacity ) => {
        const [ error ] = UpdateCourseDto.create( oid() , { capacity });
        expect( error ).toBe('La capacidad debe ser un entero mayor o igual a 0, o nulo.');
    });

    test('accepts capacity null (sin límite) and numeric strings' , () => {
        expect( UpdateCourseDto.create( oid() , { capacity : null })[1]!.capacity ).toBeNull();
        expect( UpdateCourseDto.create( oid() , { capacity : '30' })[1]!.capacity ).toBe( 30 );
    });

    test.each([ -1 , 'gratis' , '' , true ])( 'rejects price: %p' , ( price ) => {
        const [ error ] = UpdateCourseDto.create( oid() , { price });
        expect( error ).toBe('El precio debe ser un número mayor o igual a 0.');
    });

    test('accepts price 0 and keeps it distinct from "absent"' , () => {
        expect( UpdateCourseDto.create( oid() , { price : 0 })[1]!.price ).toBe( 0 );
        expect( UpdateCourseDto.create( oid() , { title : 'Nuevo' })[1]!.price ).toBeUndefined();
    });

    test('withCategoryName rejects an empty name' , () => {
        const [ , dto ] = UpdateCourseDto.create( oid() , { title : 'Nuevo' });
        expect( () => UpdateCourseDto.withCategoryName( dto! , '' ) ).toThrow();
        expect( UpdateCourseDto.withCategoryName( dto! , 'Diseño' ).category_name ).toBe('Diseño');
    });
});

describe('CreateCourseDto.create' , () => {

    const base = { title : 'Curso' , description : 'Desc' , id_category : oid() , id_owner : oid() , price : 10 };

    test('ignores id_file, thumbnail_url and category_name from the body' , () => {
        const [ error , dto ] = CreateCourseDto.create({
            ...base,
            id_file : oid(),
            thumbnail_url : 'https://evil.test/x.png',
            category_name : 'Falsa',
        });
        expect( error ).toBeUndefined();
        expect( dto!.id_file ).toBeNull();
        expect( dto!.thumbnail_url ).toBeNull();
        expect( dto!.category_name ).toBe('');
    });

    test('requires a valid price and category' , () => {
        expect( CreateCourseDto.create({ ...base , price : -1 })[0] ).toBeDefined();
        expect( CreateCourseDto.create({ ...base , price : undefined })[0] ).toBeDefined();
        expect( CreateCourseDto.create({ ...base , id_category : undefined })[0] ).toBeDefined();
    });
});

describe('UpdateModuleDto.create' , () => {

    test('allows updating only the unit' , () => {
        const [ error , dto ] = UpdateModuleDto.create({ id : oid() , unit : 2 });
        expect( error ).toBeUndefined();
        expect( dto!.unit ).toBe( 2 );
        expect( dto!.title ).toBeUndefined();
    });

    test.each([ 123 , { length : 10 } , null ])( 'rejects a non-string title: %p' , ( title ) => {
        expect( UpdateModuleDto.create({ id : oid() , title })[0] ).toBeDefined();
    });

    test.each([ -1 , 'uno' , 1.5 ])( 'rejects unit: %p' , ( unit ) => {
        expect( UpdateModuleDto.create({ id : oid() , unit })[0] ).toBe('La unidad debe ser un entero mayor o igual a 0.');
    });

    test('never reads id_course nor id_lessons from the body' , () => {
        const [ , dto ] = UpdateModuleDto.create({ id : oid() , title : 'Módulo nuevo' , id_course : oid() , id_lessons : [] });
        expect( dto ).not.toHaveProperty('id_course');
        expect( dto ).not.toHaveProperty('id_lessons');
    });
});

describe('UpdateLessonDto.create' , () => {

    test('never reads id_module nor id_file from the body' , () => {
        const [ error , dto ] = UpdateLessonDto.create({ id : oid() , title : 'Lección' , id_module : oid() , id_file : oid() });
        expect( error ).toBeUndefined();
        expect( dto ).not.toHaveProperty('id_module');
        expect( dto ).not.toHaveProperty('id_file');
    });

    test('rejects an empty update and an invalid id' , () => {
        expect( UpdateLessonDto.create({ id : oid() })[0] ).toBeDefined();
        expect( UpdateLessonDto.create({ id : 'abc' , title : 'Lección' })[0] ).toBeDefined();
    });
});

describe('UpdateUserDto.create' , () => {

    test.each([ 'first_name' , 'last_name' , 'email' ])( 'rejects %s: null' , ( field ) => {
        expect( UpdateUserDto.create({ id : oid() , [ field ] : null })[0] ).toBeDefined();
    });
});

describe('PaymentUpdateDto' , () => {

    test('fromGatewayOrder maps each named param to its field (no permutation)' , () => {
        const dto = PaymentUpdateDto.fromGatewayOrder({ id : 'mongo-id' , id_payment : 'mp-id' , status : 'processed' });
        expect( dto.id ).toBe('mongo-id');
        expect( dto.id_payment ).toBe('mp-id');
        expect( dto.status ).toBe('processed');
    });

    test('statusFromGateway leaves the local id undefined' , () => {
        const dto = PaymentUpdateDto.statusFromGateway({ id_payment : 'mp-id' , status : 'processed' });
        expect( dto.id ).toBeUndefined();
        expect( dto.id_payment ).toBe('mp-id');
    });
});
