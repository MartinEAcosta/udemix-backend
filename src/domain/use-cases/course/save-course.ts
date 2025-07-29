import { CourseRepository } from "../../repository/course-repository";

import { CourseEntity } from "../../entities/course.entity";
import { CreateCourseDto } from "../../dtos/course/create-course.dto";

export interface SaveCourseUseCase {
    execute( createCourseDto : CreateCourseDto ) : Promise<CourseEntity>;
}

export class SaveCourse implements SaveCourseUseCase {
    
    constructor(
        private readonly courseRepository : CourseRepository, 
    ) {}

    execute(createCourseDto: CreateCourseDto): Promise<CourseEntity> {
        return this.courseRepository.saveCourse( createCourseDto );
    }

}