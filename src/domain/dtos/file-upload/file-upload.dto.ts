// Este seria el objeto que se encarga de persistir la data como tal en el provedor de imgs, en este caso Cloudinary.

export type ResourceValidTypes = "image" | "video" | "raw" | "auto" | undefined;
export const validmimeTypes : ResourceValidTypes[] = ["image", "video", "raw", "auto", undefined];

interface UploadFileDtoOptions {
    lesson_title    : string,
    unit            : number,
    chapter         : number,
    size            : number;
    data            : Buffer;
    mimetype        : string;
    id_course       : string;
}

export class UploadFileDto {

    public lesson_title : string;
    public unit      : number;
    public chapter   : number;
    public size      : number;
    public data      : Buffer;
    public mimetype  : string;
    public id_course : string;


    // public format : ResourceValidTypes

    constructor( options : UploadFileDtoOptions ) {
        const { lesson_title, unit, chapter, size, data, mimetype, id_course } = options;
        this.lesson_title = lesson_title;
        this.unit = unit;
        this.chapter = chapter;
        this.size = size;
        this.data = data;
        this.mimetype = mimetype;
        this.id_course = id_course;
        // this.format = format;
    }


    static create = ( props : { [ key : string ] : any } ) : [ string? , UploadFileDto?] => {
        const { lesson_title, unit, chapter, size, data, mimetype , format, id_course } = props;

        if( !lesson_title ) return ['El nombre del archivo es requerido.', undefined];
        if( size === null || size === undefined ) return ['El tamaño del archivo es requerido.', undefined];
        if( !data ) return ['Los datos del archivo son requeridos.', undefined];
        if( !mimetype ) return ['El tipo del archivo es requerido.', undefined];
        if( !validmimeTypes.includes( format ) ) return ['El formato del archivo es requerido.', undefined];

        return [ undefined , new UploadFileDto( { lesson_title, unit, chapter, size, data, mimetype, id_course } ) ];
    }

    get type() : string {
        return this.mimetype.split('/')[0].toLowerCase();
    }

}