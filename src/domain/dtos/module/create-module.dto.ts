
interface CreateModuleDtoOptions {
    title     : string;
    unit      : number;
    id_lessons : string[];
    id_course : string;
}

export class CreateModuleDto {

    public readonly title      : string;
    public readonly unit       : number;
    public readonly id_lessons : string[];
    public readonly id_course  : string;

    constructor ( options : CreateModuleDtoOptions ) {
        const { title , unit , id_lessons, id_course } = options;
        this.title = title;
        this.unit = unit;
        this.id_lessons = id_lessons;
        this.id_course = id_course;
    }

    static create = ( props : { [ key : string ] : any } ) : [ string?, CreateModuleDto? ]  => {
        const { title , unit, id_lessons = [], id_course } = props;

        if( !title ) return [ 'El modulo debe de contener un titulo.' , undefined];
        if( !unit ) return [ 'El modulo debe de contener un numero de unidad.' , undefined];
        if( !id_course ) return [ 'El modulo necesita asignarse a un curso.' , undefined];
        
        return [ undefined , new CreateModuleDto( { title, unit, id_lessons , id_course } )];
    }
    

}