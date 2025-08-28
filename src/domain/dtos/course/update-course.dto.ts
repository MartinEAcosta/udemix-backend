

export class UpdateCourseDto {

    private constructor(
        public readonly id : string,
        public readonly title : string,
        public readonly description : string,
        public readonly category : string,
        public readonly id_owner : string,
        public readonly price : number,
        public readonly thumbnail_url ?: string | null,
        public readonly thumbnail_id ?: string | null,
        public readonly capacity? : number,
    ){}
        

    static create = ( id : string, props: { [ key:string ] : any } ) : [ string? , UpdateCourseDto? ] => {
        const { title, description, category, thumbnail_url, thumbnail_id , id_owner, price, capacity } = props;

        return [ undefined, new UpdateCourseDto( 
                                                id, 
                                                title, 
                                                description, 
                                                category, 
                                                thumbnail_url, 
                                                thumbnail_id , 
                                                id_owner, 
                                                price, 
                                                capacity
                                            ) 
                ];
    }
}