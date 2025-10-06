
interface CourseEntityOptions {
    id : string;
    title : string ;
    description : string; 
    id_category : string;
    thumbnail_url ?: string;
    id_file ?: string;
    id_owner : string;
    price : number;
    capacity ?: number;
    current_enrolled ?: number;
}


export class CourseEntity {
    public id : string;
    public title : string;
    public description : string;
    public id_category : string;
    public thumbnail_url : string | null;
    public id_file  : string | null;
    public id_owner : string;
    public price : number;
    public capacity ?: number;
    public current_enrolled : number;


    private constructor ( options : CourseEntityOptions){
        const { id , title , description , id_category , thumbnail_url, id_file, id_owner , price , capacity , current_enrolled } = options;
        this.id = id;       
        this.title = title;
        this.description = description;
        this.id_category = id_category;
        this.thumbnail_url = thumbnail_url ?? null;
        this.id_file = id_file ?? null;
        this.id_owner = id_owner;
        this.price = price;
        this.capacity = capacity;
        this.current_enrolled = current_enrolled ?? 0;
    }


    static fromObject = ( object: { [ key: string ] : any } ): CourseEntity => {
        const { id , title, description, id_category , thumbnail_url, id_file,
                 id_owner , price , capacity = undefined , current_enrolled = 0 } = object;

        if( !title ) throw 'El titulo es requerido.';
        if( !description ) throw 'La descripción es requerida.';
        if( !id_owner ) throw 'El creador del curso es requerido.';
        if( price === null || price === undefined ) throw 'El precio es requerido.';
    
        return new CourseEntity(
            { 
                id ,
                title,
                description,
                id_category, 
                thumbnail_url,
                id_file, 
                id_owner, 
                price,
                capacity,
                current_enrolled,
            }
        );
    }


}