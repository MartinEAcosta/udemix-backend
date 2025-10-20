import { CourseEntity } from "../../entities/course.entity";
import { CourseRepository } from "../../repository";

interface FindCoursesByIdsUseCase {
    execute( id_courses : string[] ) : Promise<CourseEntity[]>;
}

export class FindCoursesByIds implements FindCoursesByIdsUseCase {

    constructor( 
        private readonly courseRepository : CourseRepository,
     ){ }

    async execute( id_courses : string[] ): Promise<CourseEntity[]> {

        const courses = await this.courseRepository.findCoursesByIds( id_courses );

        return courses;
    }


}