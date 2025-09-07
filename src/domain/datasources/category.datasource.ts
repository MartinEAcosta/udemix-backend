import { CreateCategoryDto } from "../dtos/category/create-category-dto";
import { CategoryEntity } from "../entities/category.entity";

export abstract class CategoryDatasource {

    abstract findAllCategories( ) : Promise<CategoryEntity[]>;
    abstract createCategory( categoryRequestDto : CreateCategoryDto ) : Promise<CategoryEntity>;
    
}