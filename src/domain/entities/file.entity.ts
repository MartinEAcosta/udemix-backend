import { ResourceValidTypes } from "../dtos/file-upload/file.dto";

interface FileEntityOptions {
    filename: string;
    size: number;
    extension : string;
    resource_type : ResourceValidTypes;
    public_url? : string;
}

export class FileEntity {
    public filename: string;
    public size: number;
    public extension: string;
    public resource_type: ResourceValidTypes;

    private constructor( options : FileEntityOptions ) {
        this.filename =  options.filename;
        this.size = options.size;
        this.extension = options.extension;
        this.resource_type = options.resource_type as ResourceValidTypes;
    }

    static fromObject = ( object: { [ key: string ] : any } ) : FileEntity => {
        const { filename, size, extension , resource_type , public_url } = object;
        
        if( !filename ) throw 'El nombre del archivo es requerido.';
        if( size === null || size === undefined ) throw 'El tamaño del archivo es requerido.';

        return new FileEntity({
            filename : filename ,
            size : size,
            extension : extension,
            resource_type : resource_type,
            public_url : public_url,
        });
    }

}