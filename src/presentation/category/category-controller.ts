import { Request, Response } from "express";
import { CategoryRepository } from "../../domain/repository/category-repository";
import { HandlerResponses } from "../helpers/handler-responses";
import { CustomError } from "../../domain/errors/custom-error";

import { FindAllCategories } from "../../domain/use-cases/category/find-all-categories";
import { CreateCategoryDto } from "../../domain/dtos/category/create-category-dto";
import { CreateCategory } from "../../domain/use-cases/category/create-category";
import { DeleteCategory } from "../../domain/use-cases/category/delete-category";


export class CategoryController {

    constructor( 
        private readonly categoryRepository : CategoryRepository,
    ) { }

 
    public findAllCategories = ( req : Request , res : Response ) => {

        new FindAllCategories( this.categoryRepository )
            .execute()
                .then( course => HandlerResponses.handleSuccess( res, course, 200 ) )
                .catch( error => HandlerResponses.handleError( error , res ) );
    }

    public deleteCategory = ( req : Request , res : Response ) => {

        const { id } = req.params;
        if( !id ) HandlerResponses.handleError( CustomError.badRequest('Debes indicar un id valido.') , res );

        new DeleteCategory( this.categoryRepository )
            .execute( id )
                .then( course => HandlerResponses.handleSuccess( res, course, 200 ) )
                .catch( error => HandlerResponses.handleError( error , res ) );

    }

    public createCategory = ( req : Request , res : Response ) => {

        const { name , slug } = req.body;

        const [ error , categoryRequestDto ] = CreateCategoryDto.create( { name , slug } );
        if( error ) return HandlerResponses.handleError( CustomError.badRequest(error) , res );

        new CreateCategory( this.categoryRepository )
            .execute( categoryRequestDto! )
                .then( course => HandlerResponses.handleSuccess( res, course, 201 ) )
                .catch( error => HandlerResponses.handleError( error , res ) );
    }
}