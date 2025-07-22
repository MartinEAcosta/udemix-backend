import mongoose from 'mongoose';

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

    // avatar : {
    //     type: String,
    // }

});

export const UserModel  = mongoose.model( 'User' , userSchema )