import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import mongoose, { Types } from 'mongoose';

import { envs } from '../../../src/config/envs';
import { MongoDatabase } from '../../../src/data/init';
import { CourseModel } from '../../../src/data/mongo/models/course.model';
import { CourseDatasourceImpl } from '../../../src/infraestructure/datasources/course-datasource-impl';
import { UpdateCourseDto } from '../../../src/domain/dtos/course/update-course.dto';
import { SetCourseThumbnailDto } from '../../../src/domain/dtos/course/set-course-thumbnail.dto';
import { FileResponseDto } from '../../../src/domain/dtos/file/file-response.dto';

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
        const [ error , updateDto ] = UpdateCourseDto.create( new Types.ObjectId().toString() , { capacity : 'muchos' });

        expect( error ).toBe('La capacidad debe ser un entero mayor o igual a 0, o nulo.');
        expect( updateDto ).toBeUndefined();
    });

    // La whitelist del $set: current_enrolled sólo se mueve con el $inc de saveEnrollment e
    // id_owner no se reasigna. Ni inyectándolos en una instancia legítima (Object.assign) ni con un
    // impostor sobre el prototipo (Object.create) llegan al documento.
    test('should never write keys injected into a legit DTO via Object.assign' , async() => {
        const course = await createCourse({ current_enrolled : 7 });
        const originalOwner = course.id_owner.toString();

        const [ , legit ] = UpdateCourseDto.create( course._id.toString() , { title : 'Otro título' });
        const tampered = Object.assign( legit! , {
            current_enrolled : 0,
            id_owner : new Types.ObjectId().toString(),
            thumbnail_url : 'https://evil.test/x.png',
        });

        await courseDatasource.updateCourse( tampered );

        const raw = await CourseModel.findById( course._id ).lean();
        expect( raw!.title ).toBe('Otro título');
        expect( raw!.current_enrolled ).toBe( 7 );
        expect( raw!.id_owner.toString() ).toBe( originalOwner );
        expect( raw!.thumbnail_url ).not.toBe('https://evil.test/x.png');
    });

    test('should never write keys of an Object.create impostor outside the whitelist' , async() => {
        const course = await createCourse({ current_enrolled : 7 });
        const originalOwner = course.id_owner.toString();

        const impostor = Object.assign( Object.create( UpdateCourseDto.prototype ) , {
            id : course._id.toString(),
            current_enrolled : 0,
            id_owner : new Types.ObjectId().toString(),
        }) as UpdateCourseDto;

        await courseDatasource.updateCourse( impostor );

        const raw = await CourseModel.findById( course._id ).lean();
        expect( raw!.current_enrolled ).toBe( 7 );
        expect( raw!.id_owner.toString() ).toBe( originalOwner );
    });

    test('should keep the owner untouched on a legit update built from the DTO' , async() => {
        const course = await createCourse();
        const originalOwner = course.id_owner.toString();

        const [ , updateDto ] = UpdateCourseDto.create( course._id.toString() , {
            title : 'Título nuevo',
            // No están en el DTO: create() los descarta en la desestructuración.
            id_owner : new Types.ObjectId().toString(),
            current_enrolled : 0,
        });

        await courseDatasource.updateCourse( updateDto! );

        const raw = await CourseModel.findById( course._id ).lean();
        expect( raw!.title ).toBe('Título nuevo');
        expect( raw!.id_owner.toString() ).toBe( originalOwner );
        expect( raw!.current_enrolled ).toBe( 7 );
    });

});

describe('Course Datasource Implementation - setCourseThumbnail' , () => {

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

    const createCourse = async() => {
        return await CourseModel.create({
            title : 'Curso base',
            description : 'Descripción base',
            id_category : new Types.ObjectId(),
            category_name : 'Programación',
            id_owner : new Types.ObjectId(),
            price : 100,
        });
    }

    const uploadedFile = ( id : string ) : FileResponseDto => ({
        id,
        public_id : 'test/thumb',
        url : 'https://cdn.test/thumb.jpg',
        folder : 'course',
        size : 1024,
        extension : 'jpg',
        resource_type : 'image',
    });

    test('should write id_file and thumbnail_url together' , async() => {
        const course = await createCourse();
        const fileId = new Types.ObjectId().toString();

        const updated = await courseDatasource.setCourseThumbnail(
            SetCourseThumbnailDto.fromUploadedFile( course._id.toString() , uploadedFile( fileId ) )
        );

        expect( updated.id_file ).toBe( fileId );
        expect( updated.thumbnail_url ).toBe('https://cdn.test/thumb.jpg');
    });

    test('should clear id_file and thumbnail_url together' , async() => {
        const course = await createCourse();

        await courseDatasource.setCourseThumbnail(
            SetCourseThumbnailDto.fromUploadedFile( course._id.toString() , uploadedFile( new Types.ObjectId().toString() ) )
        );

        const cleared = await courseDatasource.setCourseThumbnail(
            SetCourseThumbnailDto.cleared( course._id.toString() )
        );

        expect( cleared.id_file ).toBeNull();
        expect( cleared.thumbnail_url ).toBeNull();
    });

    test('should not touch current_enrolled when setting the thumbnail' , async() => {
        const course = await CourseModel.create({
            title : 'Curso base',
            description : 'd',
            id_category : new Types.ObjectId(),
            category_name : 'Programación',
            id_owner : new Types.ObjectId(),
            price : 100,
            current_enrolled : 5,
        });

        await courseDatasource.setCourseThumbnail(
            SetCourseThumbnailDto.cleared( course._id.toString() )
        );

        const raw = await CourseModel.findById( course._id ).lean();
        expect( raw!.current_enrolled ).toBe( 5 );
    });

    test('should reject a plain object' , async() => {
        const course = await createCourse();

        await expect(
            courseDatasource.setCourseThumbnail({
                id_course : course._id.toString(),
                id_file : null,
                thumbnail_url : null,
            } as unknown as SetCourseThumbnailDto )
        ).rejects.toThrow();
    });

});
