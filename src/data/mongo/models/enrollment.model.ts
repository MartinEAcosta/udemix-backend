import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({

    idUser : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    idCourse : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Course',
        required: true,
    },

    purchaseDate : {
        type: Date,
        required: true,
    },

});

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export const EnrollmentModel = mongoose.model( 'Enrollment' , enrollmentSchema );