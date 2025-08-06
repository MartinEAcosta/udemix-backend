
export type ResourceValidTypes = "image" | "video" | "raw" | "auto" | undefined;
export const validTypes : ResourceValidTypes[] = ["image", "video", "raw", "auto", undefined];

export interface FileEntityOptions {
    name: string;
    size: number;
    data: Buffer;
    type : string;
    format : "image" | "video" | "raw" | "auto" | undefined;
}


export class FileEntity {

    public name : string;
    public size : number;
    public data : Buffer;
    public type : string;
    public format : "image" | "video" | "raw" | "auto" | undefined;

    constructor( fileOptions : FileEntityOptions ) {
        const { name, size, data, type, format } = fileOptions;
        this.name = name;
        this.size = size;
        this.data = data;
        this.type = type;
        this.format = format;
    }

    
    static fromObject = ( object: { [ key: string ] : any } ): FileEntity => {
        const { name, size, data , type , format} = object;
        
        if( !name ) throw 'El nombre del archivo es requerido.';
        if( size === null || size === undefined ) throw 'El tamaño del archivo es requerido.';
        if( !validTypes.includes(type as any) ) throw `El tipo del archivo debe ser uno de los siguientes: ${validTypes.join(', ')}`;
        if( !data ) throw 'Los datos del archivo son requeridos.';

        return new FileEntity({ name, size, data , type , format});
    }

}