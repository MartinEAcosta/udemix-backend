import mongoose, { Schema } from "mongoose";

const lessonSchema = new mongoose.Schema({

    id_course : {
        type : Schema.Types.ObjectId,
        ref : 'Course',
    },

    title : {
        type : String,
        required : true,
    },

    description : {
        type : String,
        required : true,
    },

    id_file : {
        type : Schema.Types.ObjectId,
        ref : 'File',
    },

    unit : {
        type : Number,
    },

    chapter : {
        type : Number,
    },

});

export const LessonModel = mongoose.model( 'Lesson' , lessonSchema );