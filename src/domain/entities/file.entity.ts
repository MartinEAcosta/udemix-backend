import { ResourceValidTypes } from "../dtos/file-upload/file-upload.dto";

interface FileEntityOptions {
    id : string;
    size: number;
    extension : string;
    resource_type : ResourceValidTypes;
    public_id : string;
}

export class FileEntity {
    public id            : string;
    public size          : number;
    public extension     : string;
    public resource_type : ResourceValidTypes;
    public public_id     : string;

    private constructor( options : FileEntityOptions ) {
        const { id, size, extension, resource_type, public_id } = options;
        this.id = id;
        this.size = size;
        this.extension = extension;
        this.resource_type = resource_type as ResourceValidTypes;
        this.public_id = public_id;
    }

    static fromObject = ( object: { [ key: string ] : any } ) : FileEntity => {
        const { id  , size, extension , resource_type , public_id } = object;
        
        if( size === null || size === undefined ) throw 'El tamaño del archivo es requerido.';

        return new FileEntity({
            id : id,
            size : size,
            extension : extension,
            resource_type : resource_type,
            public_id : public_id,
        });
    }

}