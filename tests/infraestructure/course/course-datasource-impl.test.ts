import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import mongoose, { Types } from 'mongoose';

import { envs } from '../../../src/config/envs';
import { MongoDatabase } from '../../../src/data/init';
import { CourseModel } from '../../../src/data/mongo/models/course.model';
import { CourseDatasourceImpl } from '../../../src/infraestructure/datasources/course-datasource-impl';
import { UpdateCourseDto } from '../../../src/domain/dtos/course/update-course.dto';

describe('Course Datasource Implementation - updateCourse' , () => {

    beforeAll(async() => {
        await MongoDatabase.connect({ dbUrl : envs.DB_CON , dbName : envs.DB_NAME });
    });

    beforeEach(async() => {
        await CourseModel.deleteMany({});
    });

    afterAll(async() => {
        await mongoose.connection.close();
    });

    const courseDatasource = new CourseDatasourceImpl();

    const createCourse = async( overrides : Record<string , unknown> = {} ) => {
        return await CourseModel.create({
            title : 'Curso base',
            description : 'Descripción base',
            id_category : new Types.ObjectId(),
            category_name : 'Programación',
            id_owner : new Types.ObjectId(),
            price : 100,
            capacity : 30,
            current_enrolled : 7,
            ...overrides,
        });
    }

    // Regresión: UpdateCourseDto.create defaulteaba capacity a null, y como el datasource
    // pasaba el DTO entero, cualquier update que la omitiera le borraba el cupo al curso.
    test('should not wipe the stored capacity when the payload omits it' , async() => {
        const course = await createCourse({ capacity : 30 });

        const [ error , updateDto ] = UpdateCourseDto.create( course._id.toString() , { title : 'Título nuevo' });
        expect( error ).toBeUndefined();

        const updated = await courseDatasource.updateCourse( updateDto! );

        expect( updated.title ).toBe('Título nuevo');
        expect( updated.capacity ).toBe( 30 );
    });

    test('should set the capacity to null when it is sent explicitly' , async() => {
        const course = await createCourse({ capacity : 30 });

        const [ error , updateDto ] = UpdateCourseDto.create( course._id.toString() , { capacity : null });
        expect( error ).toBeUndefined();

        await courseDatasource.updateCourse( updateDto! );

        // null es un valor real: así se marca un curso sin límite de cupo.
        const raw = await CourseModel.findById( course._id ).lean();
        expect( raw!.capacity ).toBeNull();
    });

    test('should reject a capacity that is not a number nor null' , () => {
        const [ error , updateDto ] = UpdateCourseDto.create( 'anyId' , { capacity : 'muchos' });

        expect( error ).toBe('La capacidad debe ser un número válido o nulo.');
        expect( updateDto ).toBeUndefined();
    });

    // current_enrolled sólo se mueve con el $inc de saveEnrollment. Escribirlo desde un update
    // genérico pisa un incremento concurrente con un valor leído antes.
    test('should ignore current_enrolled coming through the generic update' , async() => {
        const course = await createCourse({ current_enrolled : 7 });

        await courseDatasource.updateCourse({
            id : course._id.toString(),
            title : 'Otro título',
            current_enrolled : 0,
        } as unknown as UpdateCourseDto );

        const raw = await CourseModel.findById( course._id ).lean();
        expect( raw!.current_enrolled ).toBe( 7 );
        expect( raw!.title ).toBe('Otro título');
    });

    test('should ignore id_owner coming through the generic update' , async() => {
        const course = await createCourse();
        const originalOwner = course.id_owner.toString();

        await courseDatasource.updateCourse({
            id : course._id.toString(),
            id_owner : new Types.ObjectId().toString(),
        } as unknown as UpdateCourseDto );

        const raw = await CourseModel.findById( course._id ).lean();
        expect( raw!.id_owner.toString() ).toBe( originalOwner );
    });

    test('should still write the fields on the whitelist, including explicit nulls' , async() => {
        const course = await createCourse({ thumbnail_url : 'https://cdn.test/old.jpg' });

        await courseDatasource.updateCourse({
            id : course._id.toString(),
            thumbnail_url : null,
            id_file : null,
        } as unknown as UpdateCourseDto );

        const raw = await CourseModel.findById( course._id ).lean();
        expect( raw!.thumbnail_url ).toBeNull();
        expect( raw!.id_file ).toBeNull();
    });

});
