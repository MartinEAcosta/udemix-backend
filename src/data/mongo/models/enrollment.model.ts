import mongoose, { Schema, Types } from "mongoose";
import { CoursePopulatedDTO } from "../../../domain/dtos/enrollment/enrollment.response.dto";

export interface IEnrollmentModel{
    _id            :   Types.ObjectId;
    id_user        :   Types.ObjectId;
    id_course      :   Types.ObjectId;
    purchaseDate   :   Date;
    progress       ?:  number;
    last_lesson    ?:  Types.ObjectId | null;
    last_accessed_at ?: Date | null;
    completed_lessons : Types.ObjectId[];
    completed_at   ?: Date | null;
}


export interface IEnrollmentDetailedModel {
    _id            :   Types.ObjectId;
    id_user        :   Types.ObjectId;
    id_course      :   CoursePopulatedDTO;
    purchaseDate   :   Date;
    progress       ?:  number;
    last_lesson    ?:  Types.ObjectId | null;
    last_accessed_at ?: Date | null;
    completed_lessons : Types.ObjectId[];
    completed_at   ?: Date | null;
}

const enrollmentSchema = new mongoose.Schema({

    id_user : {
        type     : Schema.Types.ObjectId,
        ref      : 'User',
        required : [true , 'El id del usuario es requerido.'],
    },

    id_course : {
        type     : Schema.Types.ObjectId, 
        ref      : 'Course',
        required : [true , 'El id del curso es requerido.'],
    },

    purchaseDate : {
        type    : Date,
        default : Date.now,
    },

    progress : {
        type    : Number,
        default : 0,
    },

    last_lesson: {
        type    : Schema.Types.ObjectId,
        ref     : 'Lesson',
        default : null,
    },

    last_accessed_at : {
        type    : Date,
        default : null,
    },

    completed_lessons : {
        type    : [Schema.Types.ObjectId],
        ref     : 'Lesson',
        default : [],
    },

    completed_at : {
        type    : Date,
        default : null,
    },
});

enrollmentSchema.index({ id_user: 1, id_course: 1 }, { unique: true });

export const EnrollmentModel = mongoose.model( 'Enrollment' , enrollmentSchema );