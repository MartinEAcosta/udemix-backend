

export class UpdateCourseDto {

    private constructor(
        public readonly id : string,
        public readonly price ?: number,
        public readonly capacity ?: number | null,
        public readonly title ?: string,
        public readonly description ?: string,
        public readonly id_category ?: string,
        public readonly id_owner ?: string,
        public readonly thumbnail_url ?: string | null,
        public readonly id_file ?: string | null,
    ){}
        

    static create = ( id : string, props: { [ key:string ] : any } ) : [ string? , UpdateCourseDto? ] => {
        const { title, description, id_category, thumbnail_url, id_file , id_owner, price, capacity = null} = props;

        if( isNaN( capacity ) && capacity !== undefined ){
            return [ 'La capacidad debe ser un número válido o nulo.' , undefined ];
        }

        return [ undefined, new UpdateCourseDto( 
                                                id, 
                                                price, 
                                                capacity,
                                                title, 
                                                description, 
                                                id_category, 
                                                id_owner, 
                                                thumbnail_url, 
                                                id_file , 
                                            ) 
                ];
    }
}