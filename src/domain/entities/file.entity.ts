import { ResourceValidTypes } from "../dtos/file-upload/file-upload.dto";

interface FileEntityOptions {
    id : string;
    id_course : string,
    title: string;
    unit: number,
    chapter: number,
    size: number;
    extension : string;
    resource_type : ResourceValidTypes;
    public_id : string;
}

export class FileEntity {
    public id            : string;
    public id_course     : string;
    public title         : string;
    public unit          : number;
    public chapter       : number;
    public size          : number;
    public extension     : string;
    public resource_type : ResourceValidTypes;
    public public_id     : string;

    private constructor( options : FileEntityOptions ) {
        const { id, id_course, title, unit, chapter, size, extension, resource_type, public_id } = options;
        this.id = id;
        this.id_course = id_course;
        this.title = title;
        this.unit = unit;
        this.chapter = chapter;
        this.size = size;
        this.extension = extension;
        this.resource_type = resource_type as ResourceValidTypes;
        this.public_id = public_id;
    }

    static fromObject = ( object: { [ key: string ] : any } ) : FileEntity => {
        const { id  , id_course, title, unit, chapter, size, extension , resource_type , public_id } = object;
        if( !title ) throw 'El nombre del archivo es requerido.';
        if( size === null || size === undefined ) throw 'El tamaño del archivo es requerido.';

        return new FileEntity({
            id : id,
            id_course : id_course,
            title : title ,
            unit : unit,
            chapter : chapter,
            size : size,
            extension : extension,
            resource_type : resource_type,
            public_id : public_id,
        });
    }

}