import mongoose, { Schema, Types } from "mongoose";

export interface ISingleUseTokenModel {
    _id        : Types.ObjectId;
    id_user    : Types.ObjectId;
    jti        : string;
    purpose    : string;
    expires_at : Date;
}

export const singleUseTokenSchema = new mongoose.Schema({

    id_user: {
        type     : Schema.Types.ObjectId,
        ref      : 'User',
        required : [true, 'El id_user del token es requerido.'],
    },

    jti: {
        type     : String,
        required : [true, 'El jti del token es requerido.'],
        unique   : true,
    },

    purpose: {
        type     : String,
        enum     : ['password_reset', 'email_verification'],
        required : [true, 'El purpose del token es requerido.'],
    },

    expires_at: {
        type     : Date,
        required : [true, 'La fecha de expiración del token es requerida.'],
    },

});

// TTL index: Mongo borra el documento solo una vez pasada su fecha de expiración.
singleUseTokenSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

export const SingleUseTokenModel = mongoose.model( 'SingleUseToken' , singleUseTokenSchema );
