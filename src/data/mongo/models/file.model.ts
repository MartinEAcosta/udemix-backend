import mongoose, { Types } from "mongoose";
import { ResourceValidTypes } from "../../../domain/dtos/file-upload/file-upload.dto";

export interface IFileModel {
    _id?             : Types.ObjectId; // Podría venir de la DB
    public_id        : string;
    size             : number;
    extension        : string;
    resource_type    : ResourceValidTypes;
}

// Esta entidad sera la encargada de perpetuar en la base datos cada uno de los archivos que se asignaran a un curso 
// en especifico.

const fileSchema = new mongoose.Schema({
    
    // En caso de que no tenga un public_id es porque falló el upload de Cloudinary.
    public_id: {
        type     : String,
        required : [true, 'El public_id es requerido.'],
    },

    url: {
        type     : String,
    },

    folder: {
        type     : String,
        enum     : ["users" , "courses"],
        required : true,
    },

    // En caso de no haber un size definido es porque falló el upload.
    size: {
        type     : Number,
        required : [true , 'El tamaño del archivo es requerido.'],
    },

    extension: {
        type     : String,
        required : [true, 'La extensión del archivo es requerida.'],
    },
    
    resource_type: {
        type     : String,
        enum     : ["image", "video", "raw", "auto"],
        required : [true , 'El tipo de recurso es requerido.'],
    },

});

export const FileModel = mongoose.model( 'File' , fileSchema );