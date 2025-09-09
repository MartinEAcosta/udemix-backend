import { CategoryRepository } from "../../repository/category-repository";

interface DeleteCategoryUseCase {
    execute( id : string ) : Promise<boolean>;
}

export class DeleteCategory implements DeleteCategoryUseCase {

    constructor( 
        private readonly categoryRepository : CategoryRepository,
    ) { }

    async execute( id : string ) : Promise<boolean>{
        const hasDeleted = await this.categoryRepository.deleteCategory( id );

        return hasDeleted;
    }
}