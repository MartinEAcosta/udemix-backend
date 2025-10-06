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
    
    async findCategoryBySlug( slug : string ) : Promise<CategoryEntity | null> {
        try{
            const category = await this.categoryDatasource.findCategoryBySlug( slug );
            if( !category ) return null;
            
            return CategoryEntity.fromObject( category ); 
        }
        catch( error ) {
            throw error;
        }
    }   

    async findCategoryById( id : string ) : Promise<CategoryEntity | null> {
        try{
            const category = await this.categoryDatasource.findCategoryById( id );
            if( !category ) return null;
            
            return CategoryEntity.fromObject( category ); 
        }
        catch( error ) {
            throw error;
        }
    }   

    async deleteCategory( id : string ) : Promise<boolean>{
        try{
            const hasDeleted = await this.categoryDatasource.deleteCategory( id );

            return hasDeleted;
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
            // Seria mongooseError en realidad

            throw error;
        }
    }

}