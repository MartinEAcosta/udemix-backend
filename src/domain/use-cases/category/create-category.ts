import { CreateCategoryDto } from "../../dtos/category/create-category-dto";
import { CategoryEntity } from "../../entities/category.entity";
import { CustomError } from "../../errors/custom-error";
import { CategoryRepository } from "../../repository/category-repository";

interface CreateCategoryUseCase {
    execute( createCategoryDto :CreateCategoryDto ) : Promise<CategoryEntity>;
}

export class CreateCategory implements CreateCategoryUseCase {

    constructor( 
        private readonly categoryRepository : CategoryRepository,
    ) { }

    async execute( createCategoryDto : CreateCategoryDto) : Promise<CategoryEntity> {

        const createdCategory = await this.categoryRepository.createCategory( createCategoryDto );
        if( !createdCategory ) throw CustomError.internalServer('Hubo un error al grabar la categoria.');

        return createCategoryDto;
    }

    
}