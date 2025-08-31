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
    
    public_id: {
        type     : String,
        required : true,
    },

    folder: {
        type     : String,
        required : ["users" , "courses"],
    },

    size: {
        type     : Number,
        required : true,
    },

    extension: {
        type     : String,
        required : true,
    },
    
    resource_type: {
        type     : String,
        enum     : ["image", "video", "raw", "auto"],
        required : true,
    },

});

export const FileModel = mongoose.model( 'File' , fileSchema );