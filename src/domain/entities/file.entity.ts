import { ResourceValidTypes } from "../dtos/file-upload/file-upload.dto";

interface FileEntityOptions {
    id            : string;
    public_id     : string;
    folder        : string;
    size          : number;
    extension     : string;
    resource_type : ResourceValidTypes;
}

export class FileEntity {
    public id            : string;
    public public_id     : string;
    public folder        : string;
    public size          : number;
    public extension     : string;
    public resource_type : ResourceValidTypes;

    private constructor( options : FileEntityOptions ) {
        const { id, public_id , folder , size, extension, resource_type,  } = options;
        this.id = id;
        this.public_id = public_id;
        this.folder = folder;
        this.size = size;
        this.extension = extension;
        this.resource_type = resource_type as ResourceValidTypes;
    }

    static fromObject = ( object: { [ key: string ] : any } ) : FileEntity => {
        const { id  , public_id, folder, size, extension , resource_type  } = object;
        
        if( size === null || size === undefined ) throw 'El tamaño del archivo es requerido.';

        return new FileEntity({
            id : id,
            public_id : public_id,
            folder : folder,
            size : size,
            extension : extension,
            resource_type : resource_type,
        });
    }

}