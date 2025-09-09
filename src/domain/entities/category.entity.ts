
interface CategoryOptions {
    id   : string,
    name : string,
    slug : string,
}

export class CategoryEntity {

    public id   : string;
    public name : string; 
    public slug : string;

    private constructor( options : CategoryOptions ){
        const { id , name , slug } = options;
        this.id  = id;
        this.name = name;
        this.slug = slug;
    }

    static fromObject = ( object: { [ key: string ] : any } ) : CategoryEntity => {
        const { id , name , slug } = object;

        if( !name ) throw 'El nombre de la categoria es requerido.';
        if( !slug ) throw 'El slug de la categoria es requerido.';

        return new CategoryEntity( { id , name , slug } ); 
    }
}