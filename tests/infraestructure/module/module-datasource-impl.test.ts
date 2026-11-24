import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import mongoose, { Types } from 'mongoose';

import { envs } from '../../../src/config/envs';
import { MongoDatabase } from '../../../src/data/init';
import { ModuleModel } from '../../../src/data/mongo/models/module.model';
import { ModuleDatasourceImpl } from '../../../src/infraestructure/datasources/module-datasource-impl';
import { UpdateModuleDto } from '../../../src/domain/dtos/module/update-module.dto';

describe('Module Datasource Implementation - updateModule' , () => {

    beforeAll(async() => {
        await MongoDatabase.connect({ dbUrl : envs.DB_CON , dbName : envs.DB_NAME });
    });

    beforeEach(async() => {
        await ModuleModel.deleteMany({});
    });

    afterAll(async() => {
        await mongoose.connection.close();
    });

    const moduleDatasource = new ModuleDatasourceImpl();

    const lessonIds = [ new Types.ObjectId() , new Types.ObjectId() ];

    const createModule = async() => {
        return await ModuleModel.create({
            title : 'Módulo base',
            unit : 1,
            id_lessons : lessonIds,
            id_course : new Types.ObjectId(),
        });
    }

    test('should update the fields on the whitelist' , async() => {
        const module = await createModule();

        const [ error , updateDto ] = UpdateModuleDto.create({
            id : module._id.toString(),
            title : 'Módulo renombrado',
        });
        expect( error ).toBeUndefined();

        const updated = await moduleDatasource.updateModule( updateDto! );

        expect( updated!.title ).toBe('Módulo renombrado');
    });

    // id_lessons se construye con el $addToSet de addLessonToModule. Pasarlo por el update
    // genérico permitía reemplazar el array entero desde el body y huerfanar lecciones.
    test('should ignore id_lessons coming through the generic update' , async() => {
        const module = await createModule();

        const [ error , updateDto ] = UpdateModuleDto.create({
            id : module._id.toString(),
            title : 'Módulo renombrado',
            id_lessons : [],
        });
        expect( error ).toBeUndefined();

        await moduleDatasource.updateModule( updateDto! );

        const raw = await ModuleModel.findById( module._id ).lean();
        expect( raw!.id_lessons.map( id => id.toString() ) ).toEqual( lessonIds.map( id => id.toString() ) );
    });

    test('should never write keys injected into a legit DTO via Object.assign' , async() => {
        const module = await createModule();
        const originalCourse = module.id_course.toString();

        const [ , legit ] = UpdateModuleDto.create({ id : module._id.toString() , title : 'Módulo renombrado' });
        const tampered = Object.assign( legit! , { id_lessons : [] , id_course : new Types.ObjectId().toString() });

        await moduleDatasource.updateModule( tampered );

        const raw = await ModuleModel.findById( module._id ).lean();
        expect( raw!.title ).toBe('Módulo renombrado');
        expect( raw!.id_lessons ).toHaveLength( 2 );
        expect( raw!.id_course.toString() ).toBe( originalCourse );
    });

    test('should allow updating only the unit (reordering)' , async() => {
        const module = await createModule();

        const [ error , updateDto ] = UpdateModuleDto.create({ id : module._id.toString() , unit : 3 });
        expect( error ).toBeUndefined();

        const updated = await moduleDatasource.updateModule( updateDto! );

        expect( updated!.unit ).toBe( 3 );
        expect( updated!.title ).toBe('Módulo base');
    });

    test('should not leave the DTO id key inside the update document' , async() => {
        const module = await createModule();

        const [ , updateDto ] = UpdateModuleDto.create({
            id : module._id.toString(),
            title : 'Módulo renombrado',
        });

        await moduleDatasource.updateModule( updateDto! );

        const raw = await ModuleModel.findById( module._id ).lean();
        expect( raw ).not.toHaveProperty('id');
    });

});
