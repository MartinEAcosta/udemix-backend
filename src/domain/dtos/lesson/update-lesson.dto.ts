
interface UpdateLessonDtoOptions {
    id            : string;
    id_file       : string;
    id_module     : string;
    title         : string;
    description   : string;
    lesson_number : number;
    uploaded_at   : Date;     
}

export class UpdateLessonDto {

    public readonly id            : string;
    public readonly id_file       : string;
    public readonly id_module     ?: string;
    public readonly title         ?: string;
    public readonly description   ?: string;
    public readonly lesson_number ?: number;
    public readonly uploaded_at   ?: Date;    

    constructor( options : UpdateLessonDtoOptions ) {
        this.id            = options.id;
        this.id_file       = options.id_file;
        this.id_module     = options.id_module;
        this.title         = options.title;
        this.description   = options.description;
        this.lesson_number = options.lesson_number;
        this.uploaded_at   = new Date();
    }

    static create = ( props : { [ key : string ] : any } ) : [ string?, UpdateLessonDto? ]  => {
        const { id , id_file , id_module, title , description , lesson_number, uploaded_at } = props;

        if( !id ) return ['El id de la lección por actualizar es obligatorio.' , undefined];
        if( !title ) return [ 'El curso debe de contener un titulo.' , undefined];
        if( !description ) return [ 'El curso debe de contener una descripción.' , undefined];
        
        return [ undefined , new UpdateLessonDto({ id , id_file , id_module, title, description , lesson_number, uploaded_at } )];
    }
    
}