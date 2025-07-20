import mongoose from "mongoose";

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

    imgURL : {
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