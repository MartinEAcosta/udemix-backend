import mongoose, { Schema, Types } from "mongoose";

export interface ICourseModel {
    _id           : Types.ObjectId,
    title         : string,
    description   : string,
    // TODO: Reemplazar por entidad Category
    //* category : Types.ObjectId;
    category     ?: string | null,
    thumbnail_url : string,
    id_owner         : Types.ObjectId,
    price         : number,
    capacity     ?: number | null,
}

const courseSchema = new mongoose.Schema({

    title : {
        type: String,
        required: true,
    },

    description : { 
        type: String,
        required: true,
    },

    category : {
        type: String,
    },

    thumbnail_url : {
        type: String,
        default: "",
    },

    id_owner : {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    price : {
        type: Number,
        default: 0,
    },

    capacity : {
        type: Number,
        default: undefined,
    },

});

export const CourseModel = mongoose.model( 'Course' , courseSchema );