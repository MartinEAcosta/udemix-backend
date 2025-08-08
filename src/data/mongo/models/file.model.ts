import mongoose from "mongoose";

export interface IFileModel {
    id?: string; // Podría venir de la DB
    filename: string;
    public_id : string,
    size: number;
    extension: string;
    resource_type?: "image" | "video" | "raw" | "auto";
}

const fileSchema = new mongoose.Schema({
    
    filename: {
        unique   : true,
        type     : String,
        required : true,
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
        enum     : ["image", "video", "raw", "auto", undefined],
    }

});

export const FileModel = mongoose.model('File', fileSchema);