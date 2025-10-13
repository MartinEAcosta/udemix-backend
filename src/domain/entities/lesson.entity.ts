

interface LessonEntityOptions{
    id            : string,
    id_course     : string,
    id_file       : string,
    id_module     : string,
    title         : string,
    description   : string,
    lesson_number : number,
    uploaded_at   : Date,
}

export class LessonEntity {

    public id            : string;
    public id_course     : string;
    public id_file       : string;
    public id_module     : string;
    public title         : string;
    public description   : string;
    public lesson_number : number;
    public uploaded_at   : Date;

    private constructor( options : LessonEntityOptions ) {
        const { id, id_course, id_file , id_module , title, description, 
                 lesson_number, uploaded_at } = options;

        this.id = id;
        this.id_course = id_course;
        this.id_file = id_file;
        this.id_module = id_module;
        this.title = title;
        this.description = description;
        this.lesson_number = lesson_number;
        this.uploaded_at = new Date();
    }

    static fromObject( object : { [ key : string ] : any } ) {
        const { id, id_course , id_file , id_module , title, description ,
                 lesson_number, uploaded_at } = object;

        if( !id_course ) throw 'Debes asignar un curso a la lección.';
        if( !id_module ) throw 'Debes asignar la lección a un modulo.';
        if( !title ) throw 'Debes asignar un titulo a la lección.';
        
        return new LessonEntity({
            id, id_course, id_file , id_module , title, description, 
            lesson_number, uploaded_at
        });
    }
}