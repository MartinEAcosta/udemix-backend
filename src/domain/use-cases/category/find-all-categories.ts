import { CategoryEntity } from "../../entities/category.entity";
import { CustomError } from "../../errors/custom-error";
import { CategoryRepository } from "../../repository/category-repository";

interface FindAllCategoriesUseCase {
    execute ( ) : Promise<CategoryEntity[]>;
}

export class FindAllCategories implements FindAllCategoriesUseCase {

    constructor( 
        private readonly categoryRepository : CategoryRepository,
    ) { }

    async execute () : Promise<CategoryEntity[]> {
        const categories = await this.categoryRepository.findAllCategories();
        if( !categories ) throw CustomError.notFound('No se encontraron categorias.');

        return categories;
    }
    
}