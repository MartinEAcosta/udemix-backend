import { CategoryDatasource } from "../../domain/datasources/category.datasource";
import { CreateCategoryDto } from "../../domain/dtos/category/create-category-dto";
import { CategoryEntity } from "../../domain/entities/category.entity";
import { CategoryRepository } from "../../domain/repository/category-repository";


export class CategoryRepositoryImpl implements CategoryRepository {

    constructor ( 
        private readonly categoryDatasource : CategoryDatasource,
    ) { }
    
    async findAllCategories() : Promise<CategoryEntity[]> {
        try{
            const categories = await this.categoryDatasource.findAllCategories();
            
            return categories.map( category => CategoryEntity.fromObject( category ) );
        }
        catch( error ){
            throw error;
        }
    }
    
    async createCategory( createCategoryDto : CreateCategoryDto) : Promise<CategoryEntity> {
        try{
            const createdCategory = await this.categoryDatasource.createCategory( createCategoryDto ); 

            return CategoryEntity.fromObject( createdCategory );
        }
        catch( error ){
            throw error;
        }
    }

}