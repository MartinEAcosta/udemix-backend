
export type ResourceValidTypes = "image" | "video" | "raw" | "auto" | undefined;
export const validmimeTypes : ResourceValidTypes[] = ["image", "video", "raw", "auto", undefined];

interface FileDtoOptions {
    filename : string,
    size : number;
    data : Buffer;
    mimetype : string;
    // format : ResourceValidmTypes;
}

export class FileDto {

    public filename : string;
    public size : number;
    public data : Buffer;
    public mimetype : string;
    // public format : ResourceValidTypes

    constructor( options : FileDtoOptions ) {
        const { filename, size, data, mimetype } = options;
        this.filename = filename;
        this.size = size;
        this.data = data;
        this.mimetype = mimetype;
        // this.format = format;
    }


    static create = ( props : { [ key : string ] : any } ) : [ string? , FileDto?] => {
        const { filename , size, data, mimetype , format } = props;

        if( !filename ) return ['El nombre del archivo es requerido.', undefined];
        if( size === null || size === undefined ) return ['El tamaño del archivo es requerido.', undefined];
        if( !data ) return ['Los datos del archivo son requeridos.', undefined];
        if( !mimetype ) return ['El tipo del archivo es requerido.', undefined];
        if( !validmimeTypes.includes( format ) ) return ['El formato del archivo es requerido.', undefined];

        return [ undefined , new FileDto( { filename , size, data, mimetype } ) ];
    }

    get type() : string {
        return this.mimetype.split('/')[0].toLowerCase();
    }

}