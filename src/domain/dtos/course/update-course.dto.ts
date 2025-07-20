

export class UpdateCourseDto {

    constructor(
        public readonly id : string,
        public readonly title? : string,
        public readonly description? : string,
        public readonly category? : string,
        public readonly imgUrl? : string[],
        public readonly owner? : string,
        public readonly price? : number,
        public readonly capacity? : number,
    ){}
        

    static create = ( id : string ,props: {[key:string]: any} ) : [string? , UpdateCourseDto?] => {
        const { title, description, category, imgUrl, owner, price, capacity } = props;

        return [ undefined, new UpdateCourseDto( id, title, description, category, imgUrl, owner, price, capacity) ];
    }
}