

interface LessonEntityOptions{
    id            : string,
    id_course     : string,
    title         : string,
    description   : string,
    id_file       : string,
    unit          : number,
    chapter       : number,
    lesson_number : number,
    uploaded_at   : Date,
}

export class LessonEntity {

    public id            : string;
    public id_course     : string;
    public title         : string;
    public description   : string;
    public id_file       : string;
    public unit          : number;
    public chapter       : number;
    public lesson_number : number;
    public uploaded_at   : Date;

    private constructor( options : LessonEntityOptions ) {
        const { id, id_course, title, description, id_file, 
                unit, chapter, lesson_number, uploaded_at } = options;

        this.id = id;
        this.id_course = id_course;
        this.title = title;
        this.description = description;
        this.id_file = id_file;
        this.unit = unit;
        this.chapter = chapter;
        this.lesson_number = lesson_number;
        this.uploaded_at = new Date();
    }

    static fromObject( object : { [ key : string ] : any } ) {
        const { id, id_course , title, description , id_file,
                 unit, chapter, lesson_number, uploaded_at } = object;

        if( !id_course ) throw 'Debes asignar un curso a la lección.';
        if( !title ) throw 'Debes asignar un titulo a la lección.';
        if( !id_file ) throw 'Debes adjuntar contenido a la lección.';
        
        return new LessonEntity({
            id, id_course, title, description, id_file,
            unit, chapter, lesson_number, uploaded_at
        });
    }
}