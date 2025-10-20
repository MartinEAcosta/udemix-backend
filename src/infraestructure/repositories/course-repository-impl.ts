import { CourseRepository } from '../../domain/repository/course-repository';
import { CourseDatasource } from '../../domain/datasources/course-datasource';

import { CourseEntity } from '../../domain/entities/course.entity';
import { CreateCourseDto } from '../../domain/dtos/course/create-course.dto';
import { UpdateCourseDto } from '../../domain/dtos/course/update-course.dto';
import { PaginationResponseDto } from '../../domain/dtos/shared/pagination.dto';
import { CourseQueryFilter } from '../../domain/helpers/course-query-builder';

export class CourseRepositoryImpl implements CourseRepository{

    constructor( 
        private readonly courseDatasource : CourseDatasource, 
    ){ }
    
    async findAllCourses( filter ?: CourseQueryFilter ) : Promise<CourseEntity[]> {
        try{
            const courses = await this.courseDatasource.findAllCourses( filter );

            return courses.map( course => CourseEntity.fromObject( course ) );
        }
        catch( error ){
            throw error;
        }
    }

    async findCoursesByIds( id_courses : string[] ) : Promise<CourseEntity[]> {
        try{
            const courses = await this.courseDatasource.findCoursesByIds( id_courses );

            return courses.map( CourseEntity.fromObject );
        }
        catch( error ){
            throw error;
        }
    }

    async findCoursesByCategory( category_id : string) : Promise<CourseEntity[]> {
        try{
            const courses = await this.courseDatasource.findCoursesByCategoryId( category_id );
            
            return courses.map( CourseEntity.fromObject );
        }  
        catch( error ){
            throw error;
        }
    }


    async findCoursesPaginated( page : number , limit : number ) : Promise<PaginationResponseDto<CourseEntity[]>> {
        try{
            const info = await this.courseDatasource.findCoursesPaginated( page , limit );
            const { items , ...rest } = info;
            
            return {
                ...rest,
                items : info.items.map( course => CourseEntity.fromObject(course) ),
            }
        }
        catch( error ){
            throw error;
        }
    }

    async findCourseById( id: string ) : Promise<CourseEntity | null> {
        try{
            const course = await this.courseDatasource.findCourseById(id);
            return course ? CourseEntity.fromObject( course ) : null;
        }
        catch( error ){
            throw error;
        }
    }

    async saveCourse( createCourseDto : CreateCourseDto ) : Promise<CourseEntity> {
        try{
            const courseSaved = await this.courseDatasource.saveCourse( createCourseDto );
            return CourseEntity.fromObject( courseSaved );
        }
        catch( error ){
            console.log(error);
            throw error;
        }
            
    }

    async updateCourse( updateCourseDto : UpdateCourseDto ) : Promise<CourseEntity> {
        try{
            const courseUpdated = await this.courseDatasource.updateCourse( updateCourseDto );

            return CourseEntity.fromObject(courseUpdated);
        }
        catch( error ){
            throw error;
        }
    }

    async deleteCourse( id: string ) : Promise<boolean> {
        try{
            const removed =  await this.courseDatasource.deleteCourse( id );
    
            return removed;
        }
        catch( error ){
            throw error;
        }
    }
    

}