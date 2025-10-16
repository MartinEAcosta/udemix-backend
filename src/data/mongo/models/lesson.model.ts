import mongoose, { Schema, Types } from "mongoose";
import { FilePopulatedDto } from "../../../domain/dtos/lesson/lesson.response.dto";

export interface ILessonModel {
    _id           : Types.ObjectId;
    id_course     : Types.ObjectId;
    id_file      ?: Types.ObjectId | null;
    id_module     : Types.ObjectId;
    title         : string;
    description   : string;
    lesson_number : number;
    uploaded_at   : Date;
}

export interface ILessonPopulateModel {
    _id           : Types.ObjectId;
    id_course     : Types.ObjectId;
    id_file       : FilePopulatedDto;
    id_module     : Types.ObjectId;
    title         : string;
    description   : string;
    lesson_number : number;
    uploaded_at   : Date;
}

const lessonSchema = new mongoose.Schema({

    id_course : {
        type     : Schema.Types.ObjectId,
        ref      : 'Course',
        required : [true , 'El id del curso al que se le asignara la lección es requerido.'],
    },

    id_file : {
        type     : Schema.Types.ObjectId,
        ref      : 'File',
    },
    
    id_module : {
        type     : Schema.Types.ObjectId,
        ref      : 'Module',
        required : true,
    },

    title : {
        type     : String,
        required : [true , 'El título es requerido.'],
    },

    description : {
        type     : String,
        required : [true , 'La descripción es requerida.'],
    },

    lesson_number : {
        type     : Number,
        required : [true, 'El número de la lección es requerido.'],
        default  : 0,
    },

    uploaded_at : {
        type    : Date,
        default : Date.now,
    },

});

lessonSchema.index({ id_course: 1, lesson_number: 1 }, { unique: true });

export const LessonModel = mongoose.model( 'Lesson' , lessonSchema );