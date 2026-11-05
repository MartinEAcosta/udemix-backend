import mongoose, { Schema, Types } from 'mongoose';

export interface IUserModel {
  _id             : Types.ObjectId; // Podría venir de la DB
  username        : string;
  email           : string;
  isEmailVerified : boolean;
  role            : string;
  password        ?: string | null;
  balance         : number;
  id_file         ?: Types.ObjectId | null;
}

/**
 * Mismo documento pero con `id_file` poblado: es el campo que .populate('id_file') reemplaza.
 * Usado exclusivamente para derivar el avatar_url en el login (ver LoginUser) — nunca se persiste.
 */
export interface IUserPopulateModel extends Omit<IUserModel , 'id_file'> {
  id_file : { _id : Types.ObjectId; url : string | null } | null;
}

const userSchema = new mongoose.Schema({

    username : {
        type     : String,
        required : [ true , 'El nombre de usuario es requerido.'],
    },

    email : {
        type     : String,
        required : [ true , 'El email es requerido.'],
        unique   : true,
    },

    isEmailVerified : {
        type    : Boolean,
        default : false,
    },

    role : {
        type : String,
        enum : ['student' , 'teacher' , 'admin' ],
        default : 'student'
    },

    password : {
        type     : String,
        // required : [ true , 'La contraseña es requerida.'],
    },
    
    balance : {
        type    : Number,
        default : 0,
    },
    
    id_file : {
        type: Schema.Types.ObjectId,
        ref: 'File',
        deafult : null
    }

});


export const UserModel  = mongoose.model( 'User' , userSchema );