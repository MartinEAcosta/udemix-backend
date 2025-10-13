import mongoose, { Schema, Types } from "mongoose";

export interface IModuleModel {
    _id     : Types.ObjectId; 
    title   : string;
    unit    : number;
    id_lessons : Types.ObjectId[];
    id_course : Types.ObjectId;
}

export const moduleSchema = new mongoose.Schema({
    
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
        required : [true, 'Debes asignar un curso.'],
    }
});

moduleSchema.index({ id_course: 1, unit: 1 }, { unique: true });

export const ModuleModel = mongoose.model( 'Module' , moduleSchema );