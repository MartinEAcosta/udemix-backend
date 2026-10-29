

export class CreateCourseDto {

    private constructor(
        public readonly title : string,
        public readonly description : string,
        public readonly id_category : string,
        public readonly category_name : string,
        public readonly id_file : string | null,
        public readonly thumbnail_url : string | null,
        public readonly id_owner : string,
        public readonly price : number,
        public readonly capacity ?: number | null,
    ){}

    // Retornaria un array con el error en caso de que haya y el dto undefined.
    // en caso de no haber error retorna undefined y el dto instanciandolo via el constructor
    static create = ( props : { [ key : string ] : any } ) : [ string?, CreateCourseDto? ]  => {
        const { title , description , id_category , category_name , thumbnail_url , id_file , id_owner , price , capacity } = props;

        if( !title ) return ['El titulo es requerido.', undefined];
        if( !description ) return ['La descripción es requerida.', undefined];
        if( !id_owner ) return ['El creador del curso es requerido.', undefined];

        if( capacity !== undefined && capacity !== null ){
            if( isNaN( capacity ) ) return ['La capacidad debe ser un número válido o nulo.', undefined];
            if( capacity < 0 ) return ['La capacidad no puede ser negativa.', undefined];
        }

        return [undefined , new CreateCourseDto( 
                                                title ,
                                                description ,
                                                id_category ,
                                                category_name ,
                                                thumbnail_url , 
                                                id_file ,
                                                id_owner , 
                                                price ,
                                                capacity
                                            )];
    }   
    
}