import mongoose, { Schema } from "mongoose";

export const paymentSchema = new mongoose.Schema({

    id_user  : {
        type : Schema.Types.ObjectId,
        ref   : 'User',
        required : [ true , 'El Id del usuario vinculado al pago es requerido.']
    },

    id_courses : [{
        type  : Schema.Types.ObjectId,
        ref   : 'Course',
    }],

    amount  : {
        type  : Number,
        required : [ true , 'El monto del pago es requerido.']
    },

    date  : {
        type    : Date,
        default : Date.now,
    },

    method  : {
        type     : String,
        required : [ true , 'El método de pago es requerido.']
    },


});

export const PaymentModel = mongoose.model( 'Payment' , paymentSchema );