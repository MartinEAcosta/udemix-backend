import mongoose, { Types } from "mongoose";
import { ResourceValidTypes } from "../../../domain/dtos/file-upload/file-upload.dto";

export interface IFileModel {
    _id?             : Types.ObjectId; // Podría venir de la DB
    id_course        : Types.ObjectId;
    title            : string;
    unit             : number;
    chapter          : number;
    public_id        : string;
    size             : number;
    extension        : string;
    resource_type    : ResourceValidTypes;
}

// Esta entidad sera la encargada de perpetuar en la base datos cada uno de los archivos que se asignaran a un curso 
// en especifico.

const fileSchema = new mongoose.Schema({
    
    id_course: {
        type     : Types.ObjectId,
        ref      : 'Course',
        required : true,
    },
    title: {
        unique   : true,
        type     : String,
        required : true,
    },
    unit:  {
        type     : Number,
    },
    chapter: {
        type     : Number,
    },
    public_id: {
        type     : String,
        required : true,
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

export const FileModel = mongoose.model('File', fileSchema);