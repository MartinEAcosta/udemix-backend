
interface UpdateModuleOptions {
    id : string,
    title : string,
    unit : number,
    id_lessons : string[],
    id_course : string,
}

export class UpdateModuleDto {

    public readonly id  : string;
    public readonly title      : string;
    public readonly unit       : number;
    public readonly id_lessons : string[];
    public readonly id_course  : string;
    
    private constructor ( options : UpdateModuleOptions ) {
        const { id , title, unit , id_lessons , id_course }  = options;
        this.id = id;
        this.title = title;
        this.unit = unit;
        this.id_lessons = id_lessons;
        this.id_course = id_course;
    }

    static create = ( props : { [ key : string ] : any } ) : [ string?, UpdateModuleDto? ]  => {
        const { id , title , unit , id_lessons, id_course } = props;

        if( !id ) return ['El id que intentas actualizar no puede ser nulo.', undefined];
        if( !title ) return ['El titulo no puede estar vació.', undefined];
        if( title.length < 6 ) return ['El titulo debe contener más de 6 caracteres.', undefined];

        return [ undefined , new UpdateModuleDto( { id, title, unit, id_lessons , id_course } ) ];
    }
}