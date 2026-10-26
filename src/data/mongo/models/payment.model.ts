import mongoose, { Schema, Types } from "mongoose";

export interface IPaymentModel {
    _id : Types.ObjectId,
    id_user : Types.ObjectId,
    id_courses : Types.ObjectId[],
    id_payment ?: string | null,
    amount : number,
    date : Date,
    method ?: string | null,
    status : string,
};

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

    // Este campo se encarga de almacenar el id que provee el gestor de pagos.
    id_payment : {
        type    : String,
        default : null,
    },
    
    amount  : {
        type  : Number,
        required : [ true , 'El monto del pago es requerido.']
    },

    // La idea es que se marque la ultima vez actualizado con el ultimo estado.
    date  : {
        type    : Date,
        default : Date.now,
    },

    method  : {
        type     : String,
        enum     : [ 'balance' , 'credit_card' ],
    },

    status  : {
        type     : String,
        //  'authorized' 'pending' Estos aparecen en medios de pago offline como pagofacil o rapipago.
        enum     : [  'pending' , 'in_process', 'processed' , 'rejected' ],
        required : [ true , 'Debes indicar el estado del pago.'],
    },

});

export const PaymentModel = mongoose.model( 'Payment' , paymentSchema );