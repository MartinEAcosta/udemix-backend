
export class CreateCategoryDto {

    private constructor ( 
        public readonly name : string,
        public readonly slug : string,
    ){ } 

    static create ( props : { [key:string] : any } ) : [string? , CreateCategoryDto?] {
        const { name , slug } = props;
        
        if( !name ) return ['El nombre de la categoria es requerido.', undefined];
        if( !slug ) return ['El slug de la categoria es requerido.', undefined];
        
        return [ undefined , new CreateCategoryDto( name , slug ) ];
    }

}