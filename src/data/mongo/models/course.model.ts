import mongoose, { Schema, Types } from "mongoose";

export interface ICourseModel {
    _id              : Types.ObjectId,
    title            : string,
    description      : string,
    // TODO: Reemplazar por entidad Category
    id_category     ?: Types.ObjectId | null;
    // category      : string,
    thumbnail_url   ?: string | null,
    file_id         ?: Types.ObjectId | null,
    id_owner         : Types.ObjectId,
    price            : number,
    capacity        ?: number | null,
    current_enrolled : number,
}

const courseSchema = new mongoose.Schema({

    title : {
        type     : String,
        required : [true , 'El título es requerido.'],
    },

    description : { 
        type     : String,
        required : [true , 'La descripción es requerida.'],
    },

    id_category : {
        type     : Schema.Types.ObjectId,
        ref      : 'Category'
        // required : [true , 'La categoría es requerida.'],
    },

    thumbnail_url : {
        type     : String,
    },

    file_id : {
        type     : Schema.Types.ObjectId,
        ref      : 'File',
    },

    id_owner : {
        type     : Schema.Types.ObjectId,
        ref      : 'User',
        required : [true, 'El id del propietario es requerido.'],
    },

    price : {
        type    : Number,
        default : 0,
    },

    capacity : {
        type    : Number,
        default : undefined,
    },

    current_enrolled : {
        type    : Number,
        default : 0,
    },

});

export const CourseModel = mongoose.model( 'Course' , courseSchema );