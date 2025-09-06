import mongoose, { Schema } from "mongoose";

const lessonSchema = new mongoose.Schema({

    id_course : {
        type    : Schema.Types.ObjectId,
        ref     : 'Course',
    },

    title : {
        type     : String,
        required : [true , 'El título es requerido.'],
    },

    description : {
        type     : String,
        required : [true , 'La descripción es requerida.'],
    },

    id_file : {
        type     : Schema.Types.ObjectId,
        ref      : 'File',
    },

    unit : {
        type     : Number,
    },

    chapter : {
        type     : Number,
    },

    lesson_number : {
        type     : Number,
        required : [true, 'El número de la lección es requerido.'],
        unique   : true,
    },

    uploaded_at : {
        type    : Date,
        default : Date.now,
    },

});

export const LessonModel = mongoose.model( 'Lesson' , lessonSchema );