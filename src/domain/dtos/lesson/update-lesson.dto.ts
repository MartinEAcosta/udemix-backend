
interface UpdateLessonDtoOptions {
    id             : string;
    id_module     ?: string;
    title         ?: string;
    description   ?: string;
    lesson_number ?: number;
}

export class UpdateLessonDto {

    public readonly id            : string;
    public readonly id_module     ?: string;
    public readonly title         ?: string;
    public readonly description   ?: string;
    public readonly lesson_number ?: number;

    private constructor( options : UpdateLessonDtoOptions ) {
        this.id            = options.id;
        this.id_module     = options.id_module;
        this.title         = options.title;
        this.description   = options.description;
        this.lesson_number = options.lesson_number;
    }

    static create = ( props : { [ key : string ] : any } ) : [ string?, UpdateLessonDto? ]  => {
        const { id , id_module, title , description , lesson_number } = props;

        if( !id ) return ['El id de la lección por actualizar es obligatorio.' , undefined];
        if( !title ) return [ 'El curso debe de contener un titulo.' , undefined];
        if( !description ) return [ 'El curso debe de contener una descripción.' , undefined];

        return [ undefined , new UpdateLessonDto({ id , id_module, title, description , lesson_number } )];
    }

}
