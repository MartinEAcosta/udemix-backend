

export class CreateLessonDto {

    constructor(
        public readonly id_course     : string,
        public readonly title         : string,
        public readonly description   : string,
        public readonly id_file       : string,
        public readonly unit          : number,
        public readonly chapter       : number,
        public readonly lesson_number : number,
        public readonly uploaded_at   : Date,
    ) { }

    static create = ( props : { [ key : string ] : any } ) : [ string?, CreateLessonDto? ]  => {
        const { id_course , title , description , id_file,
                 unit, chapter } =  props;
        
        if( !id_course ) return [ 'El id del curso es obligatorio.' , undefined];
        if( !title ) return [ 'El curso debe de contener un titulo.' , undefined];
        if( !description ) return [ 'El curso debe de contener una descripción.' , undefined];
        if( !id_file ) return [ 'Debes adjuntar contenido para la lección.' , undefined];
        

        return [ undefined , new CreateLessonDto( id_course , title , description , id_file ,
                                                     unit , chapter , 0 , new Date() )];
    }
    

}