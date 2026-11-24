import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import mongoose, { Types } from 'mongoose';

import { envs } from '../../../src/config/envs';
import { MongoDatabase } from '../../../src/data/init';
import { LessonModel } from '../../../src/data/mongo/models/lesson.model';
import { LessonDatasourceImpl } from '../../../src/infraestructure/datasources/lesson-datasource-impl';
import { UpdateLessonDto } from '../../../src/domain/dtos/lesson/update-lesson.dto';
import { SetLessonFileDto } from '../../../src/domain/dtos/lesson/set-lesson-file.dto';
import { FileResponseDto } from '../../../src/domain/dtos/file/file-response.dto';

describe('Lesson Datasource Implementation - updateLesson y setLessonFile' , () => {

    beforeAll(async() => {
        await MongoDatabase.connect({ dbUrl : envs.DB_CON , dbName : envs.DB_NAME });
    });

    beforeEach(async() => {
        await LessonModel.deleteMany({});
    });

    afterAll(async() => {
        await mongoose.connection.close();
    });

    const lessonDatasource = new LessonDatasourceImpl();

    const originalFileId = new Types.ObjectId();
    const originalUpload = new Date('2020-01-01T00:00:00.000Z');

    const createLesson = async() => {
        return await LessonModel.create({
            id_course : new Types.ObjectId(),
            id_module : new Types.ObjectId(),
            id_file : originalFileId,
            title : 'Lección base',
            description : 'Descripción base',
            lesson_number : 1,
            uploaded_at : originalUpload,
        });
    }

    const uploadedFile = ( id : string ) : FileResponseDto => ({
        id,
        public_id : 'test/video',
        url : 'https://cdn.test/video.mp4',
        folder : 'lesson',
        size : 2048,
        extension : 'mp4',
        resource_type : 'video',
    });

    test('should update the editable fields' , async() => {
        const lesson = await createLesson();

        const [ error , updateDto ] = UpdateLessonDto.create({
            id : lesson._id.toString(),
            title : 'Lección renombrada',
            description : 'Otra descripción',
        });
        expect( error ).toBeUndefined();

        const updated = await lessonDatasource.updateLesson( updateDto! );

        expect( updated.title ).toBe('Lección renombrada');
        expect( updated.description ).toBe('Otra descripción');
    });

    // uploaded_at era sobreescrito con new Date() por el constructor del DTO, así que un simple
    // renombre movía el timestamp de subida.
    test('should not touch uploaded_at on an edit' , async() => {
        const lesson = await createLesson();

        const [ , updateDto ] = UpdateLessonDto.create({
            id : lesson._id.toString(),
            title : 'Lección renombrada',
            description : 'Otra descripción',
        });

        await lessonDatasource.updateLesson( updateDto! );

        const raw = await LessonModel.findById( lesson._id ).lean();
        expect( raw!.uploaded_at.getTime() ).toBe( originalUpload.getTime() );
    });

    // id_file se leía del body y el check de propiedad miraba el curso de la lección, nunca de
    // quién era el File: se podía repuntar la lección a cualquier archivo del sistema.
    test('should not let the generic update touch id_file' , async() => {
        const lesson = await createLesson();

        const [ , updateDto ] = UpdateLessonDto.create({
            id : lesson._id.toString(),
            title : 'Lección renombrada',
            description : 'Otra descripción',
            id_file : new Types.ObjectId().toString(),
        });

        await lessonDatasource.updateLesson( updateDto! );

        const raw = await LessonModel.findById( lesson._id ).lean();
        expect( raw!.id_file!.toString() ).toBe( originalFileId.toString() );
    });

    test('should reject a plain object instead of silently filtering it' , async() => {
        const lesson = await createLesson();

        await expect(
            lessonDatasource.updateLesson({
                id : lesson._id.toString(),
                title : 'Lección renombrada',
                id_file : new Types.ObjectId().toString(),
            } as unknown as UpdateLessonDto )
        ).rejects.toThrow();

        const raw = await LessonModel.findById( lesson._id ).lean();
        expect( raw!.title ).toBe('Lección base');
        expect( raw!.id_file!.toString() ).toBe( originalFileId.toString() );
    });

    test('should write id_file through setLessonFile' , async() => {
        const lesson = await createLesson();
        const newFileId = new Types.ObjectId().toString();

        const updated = await lessonDatasource.setLessonFile(
            SetLessonFileDto.fromUploadedFile( lesson._id.toString() , uploadedFile( newFileId ) )
        );

        expect( updated.id_file ).toBe( newFileId );
    });

    test('should reject a plain object on setLessonFile' , async() => {
        const lesson = await createLesson();

        await expect(
            lessonDatasource.setLessonFile({
                id_lesson : lesson._id.toString(),
                id_file : new Types.ObjectId().toString(),
            } as unknown as SetLessonFileDto )
        ).rejects.toThrow();
    });

});
