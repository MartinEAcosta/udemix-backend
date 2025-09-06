import mongoose, { Types } from "mongoose";

export interface IEnrollmentModel{
    _id            :   Types.ObjectId;
    id_user        :   Types.ObjectId;
    id_course      :   Types.ObjectId;
    purchaseDate   :   Date;
    progress       ?:  number;
    completionDate ?:  Date;
}

const enrollmentSchema = new mongoose.Schema({

    id_user : {
        type     : Types.ObjectId,
        ref      : 'User',
        required : [true , 'El id del usuario es requerido.'],
    },

    id_course : {
        type     : Types.ObjectId, 
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

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export const EnrollmentModel = mongoose.model( 'Enrollment' , enrollmentSchema );