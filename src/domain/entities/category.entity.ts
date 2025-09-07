
interface CategoryOptions {
    name : string,
    slug : string,
}

export class CategoryEntity {

    public name : string; 
    public slug : string;

    private constructor( options : CategoryOptions ){
        const { name , slug } = options;
        this.name = name;
        this.slug = slug;
    }

    static fromObject = ( object: { [ key: string ] : any } ) : CategoryEntity => {
        const { name , slug } = object;

        if( !name ) throw 'El nombre de la categoria es requerido.';
        if( !slug ) throw 'El slug de la categoria es requerido.';

        return new CategoryEntity( { name , slug } ); 
    }
}