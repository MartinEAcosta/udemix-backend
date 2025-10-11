import mongoose, { Schema, Types } from "mongoose";
import { FilePopulatedDto } from "../../../domain/dtos/lesson/lesson.response.dto";

export interface ILessonModel {
    _id           : Types.ObjectId,
    id_course     : Types.ObjectId,
    title         : string;
    description   : string;
    id_file      ?: Types.ObjectId | null,
    unit         ?: number | null,
    chapter      ?: number | null;
    lesson_number : number;
    uploaded_at   : Date;
}

export interface ILessonPopulateModel {
    _id           : Types.ObjectId,
    id_course     : Types.ObjectId,
    title         : string;
    description   : string;
    id_file       : FilePopulatedDto;
    unit         ?: number | null,
    chapter      ?: number | null;
    lesson_number : number;
    uploaded_at   : Date;
}

const lessonSchema = new mongoose.Schema({

    id_course : {
        type     : Schema.Types.ObjectId,
        ref      : 'Course',
        required : [true , 'El id del curso al que se le asignara la lección es requerido.'],
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

    // unit : {
    //     type     : Number,
    // },

    modules : {
        type     : [Schema.Types.ObjectId],
        ref      : 'Module'
    },

    chapter : {
        type     : Number,
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