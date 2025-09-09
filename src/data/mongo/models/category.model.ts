import mongoose, { Types } from "mongoose";

export interface ICategoryModel {
    _id     : Types.ObjectId,
    name    : string, 
    slug    : string,
}

const categorySchema = new mongoose.Schema({

    name : {
        type     : String,
        required : [true , 'Es necesario indicar el nombre de la categoria.'],
        unique   : [true , 'Ya existe una categoria con ese nombre.'],
    },

    // Utilizado para el filtrado en urls y semantica.
    slug : {
        type     : String,
        required : [true , 'Es necesario indicar un slug.'],
        unique   : [true , 'Ya existe una categoria con ese slug.'],
    },

});

export const CategoryModel = mongoose.model( 'Category' , categorySchema );