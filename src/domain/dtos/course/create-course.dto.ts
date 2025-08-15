

export class CreateCourseDto {

    private constructor(
        public readonly title : string,
        public readonly description : string,
        public readonly category : string,
        public readonly thumbnail_url : string,
        public readonly owner : string,
        public readonly price : number,
        public readonly capacity : number,
    ){}

    // Retornaria un array con el error en caso de que haya y el dto undefined.
    // en caso de no haber error retorna undefined y el dto instanciandolo via el constructor
    static create = ( props: {[key:string]: any} ) : [string?, CreateCourseDto?] => {
        const { title , description , category , thumbnail_url , owner , price , capacity } = props;

        if( !title ) return ['El titulo es requerido.', undefined];
        if( !description ) return ['La descripción es requerida.', undefined];
        if( !owner ) return ['El creador del curso es requerido.', undefined];
        if( !price ) return ['El precio es requerido.', undefined];
    
        return [undefined , new CreateCourseDto( title , description , category , thumbnail_url , owner , price ,capacity)];
    }   
    
}