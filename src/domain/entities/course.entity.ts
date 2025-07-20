
export interface CourseEntityOptions {
    id : string;
    title : string ;
    description : string; 
    category : string;
    imgURL : string[];
    owner : string;
    price : number;
    capacity : number;
}


export class CourseEntity {
    public id : string;
    public title : string;
    public description : string;
    public category : string;
    public imgURL : string[];
    public owner : string;
    public price : number;
    public capacity : number;


    constructor ( courseOptions : CourseEntityOptions){
        const { id , title , description , category , imgURL, owner , price , capacity } = courseOptions;
        this.id = id;       
        this.title = title;
        this.description = description;
        this.category = category;
        this.imgURL = imgURL;
        this.owner = owner;
        this.price = price;
        this.capacity = capacity;
    }


    static fromObject = ( object: { [ key: string ] : any } ): CourseEntity => {
        const { _id , title, description, category  ,imgURL = [] ,
                 owner , price , capacity = undefined  } = object;

        if( !title ) throw 'El titulo es requerido.'
        if( !description ) throw 'La descripción es requerida.'
        if( !owner ) throw 'El creador del curso es requerido.'
        if( price === null || price === undefined ) throw 'El precio es requerido.'
        
    
        const course = new CourseEntity({ id : _id , title, description, category , imgURL , owner , price , capacity});
        return course;
    }


}