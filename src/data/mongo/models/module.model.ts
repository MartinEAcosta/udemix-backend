import mongoose, { Schema, Types } from "mongoose";

export interface IModuleModel {
    _id?    : Types.ObjectId; 
    title   : string;
    unit    : number;
    lessons : Types.ObjectId[];
}

const moduleSchema = new mongoose.Schema({
    
    title: {
        type     : String,
        required : [true, 'El titulo del modulo es requerido.'],
    },

    unit: {
        type     : Number,
        required : [true , 'Debes especificar el numero del modulo.'],
    },

    id_lessons: {
        type     : [Schema.Types.ObjectId],
        ref      : 'Lesson',
    },

    id_course: {
        type     : Schema.Types.ObjectId,
        ref      : 'Course',
    }
});

export const ModuleSchema = mongoose.model( 'Module' , moduleSchema );