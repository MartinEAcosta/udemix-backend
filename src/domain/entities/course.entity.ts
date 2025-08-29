
export interface CourseEntityOptions {
    id : string;
    title : string ;
    description : string; 
    category : string;
    thumbnail_url : string;
    thumbnail_id : string;
    id_owner : string;
    price : number;
    capacity ?: number;
}


export class CourseEntity {
    public id : string;
    public title : string;
    public description : string;
    public category : string;
    public thumbnail_url : string;
    public thumbnail_id  : string;
    public id_owner : string;
    public price : number;
    public capacity ?: number;


    private constructor ( options : CourseEntityOptions){
        const { id , title , description , category , thumbnail_url, thumbnail_id, id_owner , price , capacity } = options;
        this.id = id;       
        this.title = title;
        this.description = description;
        this.category = category;
        this.thumbnail_url = thumbnail_url;
        this.thumbnail_id = thumbnail_id;
        this.id_owner = id_owner;
        this.price = price;
        this.capacity = capacity;
    }


    static fromObject = ( object: { [ key: string ] : any } ): CourseEntity => {
        const { id , title, description, category , thumbnail_url, thumbnail_id,
                 id_owner , price , capacity = undefined  } = object;

        if( !title ) throw 'El titulo es requerido.';
        if( !description ) throw 'La descripción es requerida.';
        if( !id_owner ) throw 'El creador del curso es requerido.';
        if( price === null || price === undefined ) throw 'El precio es requerido.';
    
        return new CourseEntity(
            { 
                id ,
                title,
                description,
                category, 
                thumbnail_url,
                thumbnail_id, 
                id_owner, 
                price,
                capacity,
            }
        );
    }


}