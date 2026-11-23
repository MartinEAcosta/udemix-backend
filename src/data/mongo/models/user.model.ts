import mongoose, { Schema, Types } from 'mongoose';

export interface IUserModel {
  _id             : Types.ObjectId; // Podría venir de la DB
  first_name      : string;
  last_name       : string;
  email           : string;
  isEmailVerified : boolean;
  role            : string;
  password        ?: string | null;
  balance         : number;
  id_file         ?: Types.ObjectId | null;
  /**
   * Copia desnormalizada del `url` del File apuntado por `id_file`.
   * `id_file` sigue siendo la fuente de verdad (y el FK que permite borrar el archivo);
   * este campo existe para que las lecturas de usuario y el listado de cursos no tengan
   * que tocar la colección `files`. Se escribe únicamente vía AuthDatasource.updateUserAvatar,
   * en el mismo $set que `id_file`, para que el par nunca se desincronice.
   */
  avatar_url      ?: string | null;
}

const userSchema = new mongoose.Schema({

    first_name : {
        type     : String,
        required : [ true , 'El nombre es requerido.'],
    },

    last_name : {
        type     : String,
        default  : '',
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
        default : null
    },

    avatar_url : {
        type    : String,
        default : null,
    }

});


export const UserModel  = mongoose.model( 'User' , userSchema );