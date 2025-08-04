
export interface FileEntityOptions {
    name: string;
    size: number;
    data: Buffer;
    type : string;

}

export class FileEntity {

    public name : string;
    public size : number;
    public data : Buffer;
    public type : string;

    constructor( fileOptions : FileEntityOptions ) {
        const { name, size, data, type } = fileOptions;
        this.name = name;
        this.size = size;
        this.data = data;
        this.type = type;
    }

    static fromObject = ( object: { [ key: string ] : any } ): FileEntity => {
        const { name, size, data , type } = object;

        if( !name ) throw 'El nombre del archivo es requerido.';
        if( size === null || size === undefined ) throw 'El tamaño del archivo es requerido.';
        if( !data ) throw 'Los datos del archivo son requeridos.';

        return new FileEntity({ name, size, data , type });
    }

}