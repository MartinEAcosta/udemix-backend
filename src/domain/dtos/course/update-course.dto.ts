

export class UpdateCourseDto {

    private constructor(
        public readonly id : string,
        public readonly title : string,
        public readonly description : string,
        public readonly category : string,
        public readonly id_owner : string,
        public readonly price : number,
        public readonly thumbnail_url ?: string | null,
        public readonly file_id ?: string | null,
        public readonly capacity? : number,
    ){}
        

    static create = ( id : string, props: { [ key:string ] : any } ) : [ string? , UpdateCourseDto? ] => {
        const { title, description, category, thumbnail_url, file_id , id_owner, price, capacity } = props;
        return [ undefined, new UpdateCourseDto( 
                                                id, 
                                                title, 
                                                description, 
                                                category, 
                                                id_owner, 
                                                price, 
                                                thumbnail_url, 
                                                file_id , 
                                                capacity
                                            ) 
                ];
    }
}