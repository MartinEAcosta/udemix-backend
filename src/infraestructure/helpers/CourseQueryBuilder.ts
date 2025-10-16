//* Mongoose filters :
//* $gte : mayor o igual que 
//* $lte : menor o igual que 
//* $regex : contiene 'string', $options : 'i' no importan las mayus o minusculas

export interface CourseQueryFilter {
    id_category ?: string,
    minPrice    ?: number,
    maxPrice    ?: number,
    title       ?: string,
    notFullyEnrolled ?: boolean,
};

export class CourseQueryBuilder {

    private query : any ;

    constructor( ) {
        this.query = {};
    }

    public withCategoryId( id_category ?: string ) {
        if( id_category ){
            this.query.id_category = id_category;
        }
    }

    public withPriceRange( minPrice ?: number , maxPrice ?: number ) {
        if( minPrice != null || maxPrice != null ){
            this.query.price = {};
            if( minPrice != null ) this.query.price.$gte = minPrice;
            if( maxPrice != null ) this.query.price.$lte = maxPrice;
        }
    }

    public withTitle( title ?: string ) {
        if( title ){
            this.query.title = { $regex : title , $options : 'i' };
        }
    }

    public withNotFullyEnrolled( bool : boolean ) {
        if( bool ){
            this.query.$expr = { $lt : [ "$current_enrolled" , "$capacity" ] };
        }
    } 

    public getQuery( ) {
        return this.query;
    } 
}