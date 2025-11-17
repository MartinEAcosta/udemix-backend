
export interface EnrollmentOptions {
    id : string,
    id_user : string,
    id_course : string,
    purchaseDate : Date,
    progress : number,
    completed_lessons : string[],
}

export class EnrollmentEntity {

    public id : string;
    public id_user : string;
    public id_course : string;
    public purchaseDate : Date;
    public progress : number;
    public completed_lessons : string[];

    private constructor( options : EnrollmentEntity ){
        const { id , id_user , id_course , purchaseDate , progress , completed_lessons } = options;
        this.id = id;
        this.id_user = id_user;
        this.id_course = id_course;
        this.purchaseDate = purchaseDate;
        this.progress = progress;
        this.completed_lessons = completed_lessons;
     }

    static fromObject = ( object: { [ key: string ] : any } ): EnrollmentEntity => {
        const { id ,id_user , id_course , purchaseDate , progress , completed_lessons } = object;

        if( !id_user ) throw 'Es necesario un Usuario para realizar la inscripción.';
        if( !id_course ) throw 'Es necesario un Curso para realizar la inscripción.';

        return new EnrollmentEntity(
            { 
                id,
                id_user, 
                id_course,  
                purchaseDate, 
                progress, 
                completed_lessons 
            }
        );
    }
}