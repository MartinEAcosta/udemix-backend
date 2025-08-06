import mongoose from "mongoose";

export interface IFileModel {
    id?: string; // Podría venir de la DB
    filename: string;
    size: number;
    type: string;
    format?: "image" | "video" | "raw" | "auto";
}

const fileSchema = new mongoose.Schema({
    
    filename: {
        unique   : true,
        type     : String,
        required : true,
    },
    size: {
        type     : Number,
        required : true,
    },
    type: {
        type     : String,
        required : true,
    },
    format: {
        type     : String,
        enum     : ["image", "video", "raw", "auto", undefined],
    }

});

export const FileModel = mongoose.model('File', fileSchema);