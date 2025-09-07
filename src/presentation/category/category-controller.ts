import { Request, Response } from "express";
import { CategoryRepository } from "../../domain/repository/category-repository";
import { FindAllCategories } from "../../domain/use-cases/category/find-all-categories";
import { HandlerResponses } from "../helpers/handler-responses";
import { CreateCategoryDto } from "../../domain/dtos/category/create-category-dto";
import { CustomError } from "../../domain/errors/custom-error";
import { CreateCategory } from "../../domain/use-cases/category/create-category";


export class CategoryController {

    constructor( 
        private readonly categoryRepository : CategoryRepository,
    ) { }

 
    public findAllCategories = ( req : Request , res : Response ) => {

        new FindAllCategories( this.categoryRepository )
            .execute()
                .then( course => HandlerResponses.handleSuccess( res, course ) )
                .catch( error => HandlerResponses.handleError( error , res ) );
    }

    public createCategory = ( req : Request , res : Response ) => {

        const { name , slug } = req.body;

        const [ error , categoryRequestDto ] = CreateCategoryDto.create( { name , slug } );
        if( error ) return HandlerResponses.handleError( CustomError.badRequest(error) , res );

        new CreateCategory( this.categoryRepository )
            .execute( categoryRequestDto! )
                .then( course => HandlerResponses.handleSuccess( res, course ) )
                .catch( error => HandlerResponses.handleError( error , res ) );
    }
}