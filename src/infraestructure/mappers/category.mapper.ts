import { ICategoryModel } from "../../data/mongo/models/category.model";
import { CategoryResponseDto } from "../../domain/dtos/category/category.responses";

export class CategoryMapper {

    static fromCategoryResponseDto = ( categoryDoc : ICategoryModel ) : CategoryResponseDto => {
        return {
            id : categoryDoc._id.toString(),
            name : categoryDoc.name,
            slug : categoryDoc.slug,
        }
    }
}