import { CustomError } from "../errors/custom-error";

interface ModuleOptions{
    id        : string;
    title     : string;
    unit      : number;
    lessons   : string[];
    id_course : string;
}

export class ModuleEntity {

    public id        : string;
    public title     : string;    
    public unit      : number;
    public lessons  : string[];
    public id_course : string;

    private constructor( options : ModuleOptions ) {
        const { id , title , unit ,lessons , id_course } = options;
        this.id = id;
        this.title = title;
        this.unit = unit;
        this.lessons = lessons;
        this.id_course = id_course;
    }

    static fromObject( object : { [ key : string ] : any } ) {
        const { id , title , unit , lessons, id_course } = object;

        if( !title ) throw CustomError.badRequest('El titulo del modulo no puede estar vació.');
        if( !unit ) throw CustomError.badRequest('El numero del modulo no puede ser estar vació');
        if( !id_course ) throw CustomError.badRequest('El modulo debe estar asignado a un curso.');

        return new ModuleEntity({ id, title , unit ,lessons , id_course});
    }

}