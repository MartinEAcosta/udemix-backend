import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { Types } from 'mongoose';
import { UpdateCourse } from '../../../src/domain/use-cases/course/update-course';
import { UpdateCourseDto } from '../../../src/domain/dtos/course/update-course.dto';
import { CourseRepository } from '../../../src/domain/repository/course-repository';
import { CategoryRepository } from '../../../src/domain/repository/category-repository';
import { CustomError } from '../../../src/domain/errors/custom-error';

const oid = () => new Types.ObjectId().toString();

describe('UpdateCourse UseCase' , () => {

    const ownerId = oid();
    const courseId = oid();
    let courseRepository : jest.Mocked<Pick<CourseRepository, 'findCourseById' | 'updateCourse'>>;
    let categoryRepository : jest.Mocked<Pick<CategoryRepository, 'findCategoryById'>>;
    let useCase : UpdateCourse;

    const dto = ( props : Record<string, unknown> ) => UpdateCourseDto.create( courseId , props )[1]!;

    beforeEach( () => {
        courseRepository = {
            findCourseById : jest.fn<any>().mockResolvedValue({ id : courseId , id_owner : ownerId , current_enrolled : 5 }),
            updateCourse   : jest.fn<any>().mockImplementation( async ( d : any ) => d ),
        } as any;
        categoryRepository = {
            findCategoryById : jest.fn<any>().mockResolvedValue({ id : oid() , name : 'Diseño' }),
        } as any;
        useCase = new UpdateCourse( courseRepository as any , categoryRepository as any );
    });

    test('404 when the course does not exist' , async() => {
        courseRepository.findCourseById.mockResolvedValue( null as any );
        await expect( useCase.execute( dto({ title : 'Nuevo' }) , ownerId , 'teacher' ) ).rejects.toMatchObject({ statusCode : 404 });
    });

    test('401 for a non-owner, checked BEFORE the category (no 400 que filtre info)' , async() => {
        categoryRepository.findCategoryById.mockResolvedValue( null as any );
        await expect( useCase.execute( dto({ id_category : oid() }) , oid() , 'teacher' ) ).rejects.toMatchObject({ statusCode : 401 });
        expect( categoryRepository.findCategoryById ).not.toHaveBeenCalled();
    });

    test('admin bypasses the ownership check' , async() => {
        await expect( useCase.execute( dto({ title : 'Nuevo' }) , oid() , 'admin' ) ).resolves.toBeDefined();
    });

    test('400 when the category does not exist' , async() => {
        categoryRepository.findCategoryById.mockResolvedValue( null as any );
        await expect( useCase.execute( dto({ id_category : oid() }) , ownerId , 'teacher' ) ).rejects.toBeInstanceOf( CustomError );
    });

    test('stamps category_name from the validated category' , async() => {
        await useCase.execute( dto({ id_category : oid() }) , ownerId , 'teacher' );
        expect( courseRepository.updateCourse.mock.calls[0][0].category_name ).toBe('Diseño');
    });

    test('400 when capacity drops below the current enrolled count' , async() => {
        await expect( useCase.execute( dto({ capacity : 4 }) , ownerId , 'teacher' ) ).rejects.toMatchObject({ statusCode : 400 });
        await expect( useCase.execute( dto({ capacity : 5 }) , ownerId , 'teacher' ) ).resolves.toBeDefined();
    });
});
