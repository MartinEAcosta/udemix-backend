import { CreateCategoryDto } from "../dtos/category/create-category-dto";
import { CategoryEntity } from "../entities/category.entity";


export abstract class CategoryRepository {

    abstract findAllCategories( ) : Promise<CategoryEntity[]>;
    abstract findCategoryBySlug( slug : string ) : Promise<CategoryEntity | null>;
    abstract deleteCategory( id : string ) : Promise<boolean>;
    abstract createCategory( createCategoryDto : CreateCategoryDto ) : Promise<CategoryEntity>;

}