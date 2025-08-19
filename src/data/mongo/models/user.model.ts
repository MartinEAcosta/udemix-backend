import mongoose, { Types } from 'mongoose';

export interface IUserModel {
  _id     : Types.ObjectId; // Podría venir de la DB
  username : string;
  email    : string;
  password : string;
  balance  : number;
}

const userSchema = new mongoose.Schema({

    username : {
        type: String,
        required: [ true , 'El nombre de usuario es requerido.'],
    },

    email : {
        type: String,
        required: [ true , 'El email es requerido.'],
        unique: true,
    },

    // emailValidated : {
    //     type: Boolean,
    //     default: false,
    // },

    password : {
        type: String,
        required: [ true , 'La contraseña es requerida.'],
    },
    
    balance : {
        type: Number,
        default: 100,
    },

    
    // avatar : {
    //     type: String,
    // }

});

export const UserModel  = mongoose.model( 'User' , userSchema );