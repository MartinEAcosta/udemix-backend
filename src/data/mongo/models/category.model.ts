import mongoose from "mongoose";

export interface ICategoryModel {
    _id     : mongoose.Types.ObjectId,
    name    : string, 
    slug    : string,
}

const categorySchema = new mongoose.Schema({

    name : {
        type     : String,
        required : [true , 'Es necesario indicar el nombre de la categoria.'],
        unique   : true,
    },

    // Utilizado para el filtrado en urls y semantica.
    slug : {
        type     : String,
        required : [true , 'Es necesario indicar un slug.'],
        unique   : true,
    },

});

export const CategoryModel = mongoose.model( 'Category' , categorySchema );