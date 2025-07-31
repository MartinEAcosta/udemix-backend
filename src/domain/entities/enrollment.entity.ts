
export interface EnrollmentOptions {
    id_user : string,
    id_course : string,
    purchaseDate : Date,
    progress : number,
    completionDate : number,
}

export class EnrollmentEntity {

    public id_user : string;
    public id_course : string;
    public purchaseDate : Date;
    public progress : number;
    public completionDate : number;

    constructor( options : EnrollmentEntity ){
        this.id_user = options.id_user;
        this.id_course = options.id_course;
        this.purchaseDate = options.purchaseDate;
        this.progress = options.progress;
        this.completionDate = options.completionDate;
     }

    static fromObject = ( object: { [ key: string ] : any } ): EnrollmentEntity => {
        const { id_user , id_course , purchaseDate , progress , completionDate } = object;

        if( !id_user ) throw 'Es necesario un Usuario para realizar la inscripción.';
        if( !id_course ) throw 'Es necesario un Curso para realizar la inscripción.';

        return new EnrollmentEntity({ id_user , id_course,  purchaseDate , progress , completionDate });
    }
}