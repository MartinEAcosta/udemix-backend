import mongoose, { Schema, Types } from "mongoose";

export interface IEnrollmentModel{
    _id            :   Types.ObjectId;
    id_user        :   Types.ObjectId;
    id_course      :   Types.ObjectId;
    purchaseDate   :   Date;
    progress       ?:   number;
    completionDate ?:   Date;
}

const enrollmentSchema = new mongoose.Schema({

    id_user : {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    id_course : {
        type: Schema.Types.ObjectId, 
        ref: 'Course',
        required: true,
    },

    purchaseDate : {
        type: Date,
        default: Date.now,
    },

    progess : {
        type: Number,
        default : 0,
    },

    completionDate : {
        type: Date,
        default: null,
    },

});

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export const EnrollmentModel = mongoose.model( 'Enrollment' , enrollmentSchema );