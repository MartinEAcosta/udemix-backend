import { CourseRepository } from "../../repository/course-repository";

import { CourseEntity } from "../../entities/course.entity";
import { CustomError } from "../../errors/custom-error";
import { UpdateCourseDto } from "../../dtos/course/update-course.dto";

export interface UpdateCourseUseCase {
    execute( updateCourseDto : UpdateCourseDto ) : Promise<CourseEntity>;
}

export class UpdateCourse implements UpdateCourseUseCase {

    constructor(
        private readonly courseRepository : CourseRepository, 
    ) {}

    async execute(updateCourseDto: UpdateCourseDto): Promise<CourseEntity> {
        const courseToUpdate = await this.courseRepository.findCourseById( updateCourseDto.id );
        if( !courseToUpdate )  throw CustomError.notFound(`El curso con el id: ${updateCourseDto.id}, no fue encontrado`);
        const updatedCourse = await this.courseRepository.updateCourse( updateCourseDto );

        return {
           ...updatedCourse
        };
    }

}