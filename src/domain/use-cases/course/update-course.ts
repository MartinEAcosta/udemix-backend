import { UpdateCourseDto } from "../../dtos/course/update-course.dto";
import { CourseEntity } from "../../entities/course.entity";
import { CourseRepository } from "../../repository/course.repository";

export interface UpdateCourseUseCase {
    execute( updateCourseDto : UpdateCourseDto ) : Promise<CourseEntity>;
}

export class UpdateCourse implements UpdateCourseUseCase {

    constructor(
        private readonly courseRepository : CourseRepository, 
    ) {}

    execute(updateCourseDto: UpdateCourseDto): Promise<CourseEntity> {
        return this.courseRepository.updateCourse( updateCourseDto );
    }

}