

export class CreateCourseDto {

    private constructor(
        public readonly title : string,
        public readonly description : string,
        public readonly id_category : string,
        public readonly thumbnail_url : string,
        public readonly id_file : string,
        public readonly id_owner : string,
        public readonly price : number,
        public readonly capacity : number,
    ){}

    // Retornaria un array con el error en caso de que haya y el dto undefined.
    // en caso de no haber error retorna undefined y el dto instanciandolo via el constructor
    static create = ( props : { [ key : string ] : any } ) : [ string?, CreateCourseDto? ]  => {
        const { title , description , id_category , thumbnail_url, id_file , id_owner , price , capacity } = props;

        if( !title ) return ['El titulo es requerido.', undefined];
        if( !description ) return ['La descripción es requerida.', undefined];
        if( !id_owner ) return ['El creador del curso es requerido.', undefined];

        return [undefined , new CreateCourseDto( 
                                                title ,
                                                description ,
                                                id_category ,
                                                thumbnail_url , 
                                                id_file ,
                                                id_owner , 
                                                price ,
                                                capacity
                                            )];
    }   
    
}