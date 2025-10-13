
interface CreateLessonDtoOptions {
    id_course     : string;
    id_file       : string;
    id_module     : string;
    title         : string;
    description   : string;
    lesson_number : number;
    uploaded_at   : Date;
}
export class CreateLessonDto {
    
    public readonly id_course     : string;
    public readonly id_file       : string;
    public readonly id_module     : string;
    public readonly title         : string;
    public readonly description   : string;
    public readonly lesson_number : number;
    public readonly uploaded_at   : Date;

    constructor( options : CreateLessonDtoOptions ) {
        this.id_course     = options.id_course;
        this.id_file       = options.id_file;
        this.id_module     = options.id_module;
        this.title         = options.title;
        this.description   = options.description;
        this.lesson_number = options.lesson_number;
        this.uploaded_at   = new Date();
    }

    static create = ( props : { [ key : string ] : any } ) : [ string?, CreateLessonDto? ]  => {
        const { id_course , id_file , id_module , title , description , uploaded_at } =  props;
        
        if( !id_course ) return [ 'El id del curso es obligatorio.' , undefined];
        if( !id_module ) return [ 'El id del modulo es obligatorio.' , undefined];
        if( !title ) return [ 'El curso debe de contener un titulo.' , undefined];
        if( !description ) return [ 'El curso debe de contener una descripción.' , undefined];
        

        return [ undefined , new CreateLessonDto( { id_course , id_file , id_module , title , description 
                                                    , lesson_number: 0 , uploaded_at })];
    }
    

}