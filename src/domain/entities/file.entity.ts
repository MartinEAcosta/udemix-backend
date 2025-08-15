import { ResourceValidTypes } from "../dtos/file-upload/file.dto";

interface FileEntityOptions {
    id : string;
    filename: string;
    size: number;
    extension : string;
    resource_type : ResourceValidTypes;
    public_id? : string;
}

export class FileEntity {
    public id            : string;
    public filename      : string;
    public size          : number;
    public extension     : string;
    public resource_type : ResourceValidTypes;
    public public_id     : string;

    private constructor( options : FileEntityOptions ) {
        const { id ,  filename, size, extension, resource_type, public_id } = options;
        this.id = id;
        this.filename = filename;
        this.size = size;
        this.extension = extension;
        this.resource_type = resource_type as ResourceValidTypes;
        this.public_id = public_id ? public_id : '';
    }

    static fromObject = ( object: { [ key: string ] : any } ) : FileEntity => {
        const { id , _id , filename, size, extension , resource_type , public_id } = object;
        if( !filename ) throw 'El nombre del archivo es requerido.';
        if( size === null || size === undefined ) throw 'El tamaño del archivo es requerido.';

        return new FileEntity({
            id : id || _id,
            filename : filename ,
            size : size,
            extension : extension,
            resource_type : resource_type,
            public_id : public_id,
        });
    }

}