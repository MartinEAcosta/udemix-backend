import { CourseEntity } from "../../entities/course.entity";
import { CustomError } from "../../errors/custom-error";
import { CategoryRepository } from "../../repository/category-repository";
import { CourseRepository } from "../../repository/course-repository";

interface FindCoursesByCategoryUseCase {
    execute( category_id : string ) : Promise<CourseEntity[]>
}

export class FindCoursesByCategory implements FindCoursesByCategoryUseCase {

    constructor(
        private readonly coursesRepository : CourseRepository,
        private readonly categoryRepository : CategoryRepository,
    ) { }

    async execute( slug : string) : Promise<CourseEntity[]> {
        console.log('1')
        const category = await this.categoryRepository.findCategoryBySlug( slug );
        console.log('2')
        if( !category ) throw CustomError.badRequest( "No existe una categoria con ese nombre." );
        console.log('3')

        const coursesFiltered = this.coursesRepository.findCoursesByCategory( category.id );
        if( !coursesFiltered ) throw CustomError.notFound("No se han encontrado cursos vinculados a esta categoria.");

        return coursesFiltered;
    }

}