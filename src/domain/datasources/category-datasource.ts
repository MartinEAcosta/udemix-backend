import { CategoryResponseDto } from "../dtos/category/category.responses";
import { CreateCategoryDto } from "../dtos/category/create-category-dto";

export abstract class CategoryDatasource {

    // TODO : cambiar category entity;
    abstract findAllCategories( ) : Promise<CategoryResponseDto[]>;
    abstract findCategoryBySlug( slug : string ) : Promise<CategoryResponseDto | null>;
    abstract findCategoryById( id : string ) : Promise<CategoryResponseDto | null>;
    abstract deleteCategory( id : string ) : Promise<boolean>;
    abstract createCategory( categoryRequestDto : CreateCategoryDto ) : Promise<CategoryResponseDto>;
    
}