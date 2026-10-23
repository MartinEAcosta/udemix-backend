
export interface EnrollmentOptions {
    id : string,
    id_user : string,
    id_course : string,
    purchaseDate : Date,
    progress : number,
    last_lesson : string | null,
    last_accessed_at : Date | null,
    completed_lessons : string[],
}

export class EnrollmentEntity {

    public id : string;
    public id_user : string;
    public id_course : string;
    public purchaseDate : Date;
    public progress : number;
    public last_lesson : string | null;
    public last_accessed_at : Date | null;
    public completed_lessons : string[];
    public completed_at : Date | null;


    private constructor( options : EnrollmentEntity ){
        const { id ,id_user , id_course , purchaseDate , progress , 
                last_lesson = null , last_accessed_at = null , completed_lessons , completed_at = null} = options;
        this.id = id;
        this.id_user = id_user;
        this.id_course = id_course;
        this.purchaseDate = purchaseDate;
        this.progress = progress;
        this.last_lesson = last_lesson;
        this.last_accessed_at = last_accessed_at;
        this.completed_lessons = completed_lessons;
        this.completed_at = completed_at;
     }

    static fromObject = ( object: { [ key: string ] : any } ): EnrollmentEntity => {
        const { id ,id_user , id_course , purchaseDate , progress , 
                last_lesson , last_accessed_at , completed_lessons , completed_at } = object;

        if( !id_user ) throw 'Es necesario un Usuario para realizar la inscripción.';
        if( !id_course ) throw 'Es necesario un Curso para realizar la inscripción.';

        return new EnrollmentEntity(
            { 
                id,
                id_user, 
                id_course,  
                purchaseDate, 
                progress,
                last_lesson,
                last_accessed_at,
                completed_lessons,
                completed_at, 
            }
        );
    }
}