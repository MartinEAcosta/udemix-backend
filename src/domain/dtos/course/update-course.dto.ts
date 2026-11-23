

export class UpdateCourseDto {

    private constructor(
        public readonly id : string,
        public readonly price ?: number,
        public readonly capacity ?: number | null,
        public readonly title ?: string,
        public readonly description ?: string,
        public readonly id_category ?: string,
        public readonly category_name ?: string,
        public readonly id_owner ?: string,
        public readonly thumbnail_url ?: string | null,
        public readonly id_file ?: string | null,
    ){}
        

    // `capacity` NO lleva default: con `= null`, cualquier update que la omitiera le borraba el
    // cupo al curso (null sí se escribe, undefined lo descarta Mongoose) y además dejaba muerto
    // al guard de abajo, porque capacity nunca podía ser undefined acá adentro.
    // Mandar `capacity: null` explícito sigue funcionando: así se marca un curso sin límite.
    static create = ( id : string, props: { [ key:string ] : any } ) : [ string? , UpdateCourseDto? ] => {
        const { title, description, id_category, category_name , thumbnail_url, id_file , id_owner, price, capacity } = props;

        if( capacity !== undefined && capacity !== null && isNaN( capacity ) ){
            return [ 'La capacidad debe ser un número válido o nulo.' , undefined ];
        }

        return [ undefined, new UpdateCourseDto( 
                                                id, 
                                                price, 
                                                capacity,
                                                title, 
                                                description, 
                                                id_category,
                                                category_name, 
                                                id_owner, 
                                                thumbnail_url, 
                                                id_file , 
                                            ) 
                ];
    }
}