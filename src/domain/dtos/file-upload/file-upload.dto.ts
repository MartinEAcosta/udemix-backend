// Este seria el objeto que se encarga de persistir la data como tal en el provedor de imgs, en este caso Cloudinary.

export type ResourceValidTypes = "image" | "video" | "raw" | "auto" | undefined;
export const validmimeTypes : ResourceValidTypes[] = ["image", "video", "raw", "auto", undefined];

interface UploadFileDtoOptions {
    size            : number;
    data            : Buffer;
    mimetype        : string;
}

export class UploadFileDto {
    public size      : number;
    public data      : Buffer;
    public mimetype  : string;


    // public format : ResourceValidTypes

    constructor( options : UploadFileDtoOptions ) {
        const { size, data, mimetype } = options;
        this.size = size;
        this.data = data;
        this.mimetype = mimetype;
        // this.format = format;
    }


    static create = ( props : { [ key : string ] : any } ) : [ string? , UploadFileDto?] => {
        const { size, data, mimetype , format, id_course } = props;

        if( size === null || size === undefined ) return ['El tamaño del archivo es requerido.', undefined];
        if( !data ) return ['Los datos del archivo son requeridos.', undefined];
        if( !mimetype ) return ['El tipo del archivo es requerido.', undefined];
        if( !validmimeTypes.includes( format ) ) return ['El formato del archivo es requerido.', undefined];

        return [ undefined , new UploadFileDto( { size, data, mimetype } ) ];
    }

    get type() : string {
        return this.mimetype.split('/')[0].toLowerCase();
    }

}