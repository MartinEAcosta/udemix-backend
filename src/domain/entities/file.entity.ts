import { ResourceValidTypes } from "../dtos/file-upload/file.dto";

interface FileEntityOptions {
    filename: string;
    size: number;
    type : string;
    format : ResourceValidTypes;
    public_url? : string;
}

export class FileEntity {
    public filename: string;
    public size: number;
    public type: string;
    public format: ResourceValidTypes;

    private constructor( options : FileEntityOptions ) {
        this.filename =  options.filename;
        this.size = options.size;
        this.type = options.type;
        this.format = options.format as ResourceValidTypes;
    }

    static fromObject = ( object: { [ key: string ] : any } ) : FileEntity => {
        const { filename, size, type , format , public_url } = object;
        
        if( !filename ) throw 'El nombre del archivo es requerido.';
        if( size === null || size === undefined ) throw 'El tamaño del archivo es requerido.';

        return new FileEntity({
            filename : filename ,
            size : size,
            type : type,
            format : format,
            public_url : public_url,
        });
    }

}