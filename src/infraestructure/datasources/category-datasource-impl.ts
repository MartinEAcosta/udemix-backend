import { CategoryModel } from "../../data/mongo/models/category.model";
import { CategoryDatasource } from "../../domain/datasources/category.datasource";
import { CreateCategoryDto } from "../../domain/dtos/category/create-category-dto";
import { CategoryEntity } from "../../domain/entities/category.entity";
import { CategoryMapper } from "../mappers/category.mapper";

export class CategoryDataSourceImpl implements CategoryDatasource {
    
    async findAllCategories ( ) : Promise<CategoryEntity[]> {
        const categories = await CategoryModel.find({});
        
        return categories.map( category => CategoryMapper.fromCategoryResponseDto( category ));
    }
    
    async findCategoryBySlug(slug: string): Promise<CategoryEntity | null> {
        const category = await CategoryModel.findOne({ slug: slug });
        if (!category) return null;

        return CategoryMapper.fromCategoryResponseDto(category);
    }
    
    async deleteCategory( id : string ) : Promise<boolean>{
        const deletedCategory = await CategoryModel.findByIdAndDelete( id );

        return deletedCategory ? true : false;
    }

    async createCategory( categoryRequestDto : CreateCategoryDto ) : Promise<CategoryEntity> {
        const createdCategory = await CategoryModel.create( categoryRequestDto );

        return CategoryMapper.fromCategoryResponseDto( createdCategory );
    }
    
}