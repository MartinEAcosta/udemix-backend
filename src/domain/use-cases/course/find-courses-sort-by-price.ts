import { CourseEntity } from "../../entities/course.entity";
import { CourseRepository } from "../../repository/course-repository";

interface FindCoursesSortByPriceUseCase {
    execute ( order : string ) : Promise<CourseEntity[]>;
}

export class FindCoursesSortByPrice implements FindCoursesSortByPriceUseCase {

    constructor(
        private readonly coursesRepository : CourseRepository,
    ) { }

    async execute( order : string ) : Promise<CourseEntity[]> {

        const courses = await this.coursesRepository.findCoursesSortByPrice( order );

        return courses;
    }
    

}