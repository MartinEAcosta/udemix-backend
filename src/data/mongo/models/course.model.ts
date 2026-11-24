import mongoose, { Schema, Types } from "mongoose";
import { IUserModel } from "./user.model";

export interface ICourseModel {
    _id              : Types.ObjectId,
    title            : string,
    description      : string,
    id_category     ?: Types.ObjectId | null;
    category_name   ?: string | null,
    thumbnail_url   ?: string | null,
    id_file         ?: Types.ObjectId | null,
    id_owner         : Types.ObjectId,
    price            : number,
    capacity        ?: number | null,
    current_enrolled : number,
}

/** Lo que el $lookup a `users` proyecta del profesor dueño del curso. */
export type ICourseOwnerLookup = Pick<IUserModel , '_id' | 'first_name' | 'last_name' | 'avatar_url'>;

/**
 * Curso con el owner resuelto por $lookup en un campo aparte.
 * `id_owner` se conserva intacto como ObjectId — a diferencia de .populate, que lo sobreescribe
 * con el documento y haría fallar a CourseEntity.fromObject cuando el owner ya no existe.
 * `owner` puede faltar o ser null por esa misma razón.
 */
export interface ICourseWithOwnerModel extends ICourseModel {
    owner ?: ICourseOwnerLookup | null,
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
        ref      : 'Category',
        required : [true , 'La categoría es requerida.'],
    },

    category_name : {
        type    : String,
        required : [true , 'El nombre de la categoría es requerido.'],
    },

    thumbnail_url : {
        type     : String,
    },

    id_file : {
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
        default: null,
        min : 0,
    },

    current_enrolled : {
        type    : Number,
        default : 0,
    },

});


export const CourseModel = mongoose.model<ICourseModel>( 'Course' , courseSchema );