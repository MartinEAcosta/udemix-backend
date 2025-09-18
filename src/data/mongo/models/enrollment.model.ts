import mongoose, { Schema, Types } from "mongoose";
import { CoursePopulatedDto } from "../../../domain/dtos/enrollment/enrollment.response.dto";

export interface IEnrollmentModel{
    _id            :   Types.ObjectId;
    id_user        :   Types.ObjectId;
    id_course      :   Types.ObjectId;
    purchaseDate   :   Date;
    progress       ?:  number;
    completionDate ?:  Date | undefined;
}


export interface IEnrollmentDetailedModel {
    _id            :   Types.ObjectId;
    id_user        :   Types.ObjectId;
    id_course         :   CoursePopulatedDto
    purchaseDate   :   Date;
    progress       ?:  number;
    completionDate ?:  Date | undefined; 
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

    completionDate : {
        type    : Date,
        default : null,
    },

});

enrollmentSchema.index({ id_user: 1, id_course: 1 }, { unique: true });

export const EnrollmentModel = mongoose.model( 'Enrollment' , enrollmentSchema );