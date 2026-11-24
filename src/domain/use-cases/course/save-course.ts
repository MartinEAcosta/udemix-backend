import { CourseRepository } from "../../repository/course-repository";

import { CourseEntity } from "../../entities/course.entity";
import { CreateCourseDto } from "../../dtos/course/create-course.dto";
import { CustomError } from "../../errors/custom-error";
import { CategoryRepository } from "../../repository/category-repository";

export interface SaveCourseUseCase {
    execute( createCourseDto : CreateCourseDto ) : Promise<CourseEntity>;
}

export class SaveCourse implements SaveCourseUseCase {
    
    constructor(
        private readonly courseRepository : CourseRepository, 
        private readonly categoryRepository : CategoryRepository,
    ) {}

    async execute( createCourseDto : CreateCourseDto ) : Promise<CourseEntity> {
        const category = await this.categoryRepository.findCategoryById( createCourseDto.id_category );
        if( !category || !category.name ) throw CustomError.badRequest('La categoria que asignaste al curso no es valida.');


        return this.courseRepository.saveCourse( 
            {
            ...createCourseDto,
            category_name : category.name
            } 
        );
    }

}