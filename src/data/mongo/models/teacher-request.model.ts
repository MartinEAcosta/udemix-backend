import mongoose, { Types } from "mongoose";

import {
    EXPERIENCE_LEVELS,
    TEACHER_REQUEST_STATUSES,
    type ExperienceLevel,
    type TeacherRequestStatus,
} from "../../../domain/entities/teacher-request.entity";

export { EXPERIENCE_LEVELS, TEACHER_REQUEST_STATUSES };
export type { ExperienceLevel, TeacherRequestStatus };

export interface ITeacherRequestModel {
    _id: Types.ObjectId;
    id_user: Types.ObjectId;
    status: TeacherRequestStatus;
    about_you: string;
    portfolio_url: string | null;
    category_ids: Types.ObjectId[];
    experience_level: ExperienceLevel;
    course_title: string;
    course_summary: string;
    reviewed_at: Date | null;
    rejection_reason : string | null,
    created_at: Date;
};

const TeacherRequestSchema = new mongoose.Schema({

    id_user : {
        type : Types.ObjectId,
        ref : 'User',
        required : [true , "No es posible crear una solicitud de profesor sin un usuario asignado."],
    },

    status : {
        type : String,
        enum : TEACHER_REQUEST_STATUSES,
        default : 'pending',
        required: true,
    },

    about_you : {
        type : String,
        trim: true,
        required : [ true ,  'Debes contarnos sobre vos.' ],
    },

    portfolio_url : {
        type : String,
        trim : true,
        default : null,
    },

    category_ids : {       
        type: [ 
            { 
                type: Types.ObjectId, 
                ref: 'Category' 
            }
        ],
        validate: {
            validator: (v: Types.ObjectId[]) => Array.isArray(v) && v.length > 0,
            message: 'Debes seleccionar al menos una categoría.',
        },
    },

    experience_level : {
        type : String,
        enum : EXPERIENCE_LEVELS,
        required: [true, 'Debes indicar tu nivel de experiencia.'],
    },

    course_title : {
        type : String,
        required : [ true , 'Debes adjuntar un posible titulo que usarias para un curso.'],
    },

    course_summary : {
        type : String,
        required : [ true , 'Debes adjuntar una descripción sobre los contenidos a enseñar.']
    },

    reviewed_at : {
        type : Date,
        default : null,
    },

    rejection_reason : {
        type : String,
        default : null,
    }
},
{
    timestamps : { createdAt : 'created_at' , updatedAt : false }
});

export const TeacherRequestModel = mongoose.model('TeacherRequest' , TeacherRequestSchema);
