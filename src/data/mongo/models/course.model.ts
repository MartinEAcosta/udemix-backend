import mongoose, { Types } from "mongoose";

export interface ICourseModel {
    _id: Types.ObjectId,
    title : string,
    description : string,
    category? : string | null,
    imgUrl : String[],
    owner : string,
    price : number,
    capacity? : number | null,
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

    imgUrl : {
        type: [String],
    },

    owner : {
        type: String,
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'User',
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