export const TEACHER_REQUEST_STATUSES = ['pending', 'approved', 'rejected'] as const;
export const EXPERIENCE_LEVELS = ['none', 'informal', 'teacher'] as const;

export type TeacherRequestStatus = typeof TEACHER_REQUEST_STATUSES[number];
export type ExperienceLevel      = typeof EXPERIENCE_LEVELS[number];

export const isTeacherRequestStatus = ( value : any ) : value is TeacherRequestStatus =>
    TEACHER_REQUEST_STATUSES.includes( value );

export const isExperienceLevel = ( value : any ) : value is ExperienceLevel =>
    EXPERIENCE_LEVELS.includes( value );


export interface TeacherRequestEntityOptions {
    id                : string,
    id_user           : string,
    status            : TeacherRequestStatus,
    about_you         : string,
    category_ids      : string[],
    experience_level  : ExperienceLevel,
    course_title      : string,
    course_summary    : string,
    created_at        : Date,
    portfolio_url    ?: string | null,
    reviewed_at      ?: Date | null,
    rejection_reason ?: string | null,
}


export class TeacherRequestEntity {

    public id               : string;
    public id_user          : string;
    public status           : TeacherRequestStatus;
    public about_you        : string;
    public category_ids     : string[];
    public experience_level : ExperienceLevel;
    public course_title     : string;
    public course_summary   : string;
    public created_at       : Date;
    public portfolio_url    : string | null;
    public reviewed_at      : Date | null;
    public rejection_reason : string | null;

    private constructor( options : TeacherRequestEntityOptions ){
        const {
            id , id_user , status , about_you , category_ids , experience_level ,
            course_title , course_summary , created_at , portfolio_url , reviewed_at , rejection_reason
        } = options;

        this.id = id;
        this.id_user = id_user;
        this.status = status;
        this.about_you = about_you;
        this.category_ids = category_ids;
        this.experience_level = experience_level;
        this.course_title = course_title;
        this.course_summary = course_summary;
        this.created_at = created_at;
        this.portfolio_url = portfolio_url ?? null;
        this.reviewed_at = reviewed_at ?? null;
        this.rejection_reason = rejection_reason ?? null;
    }

    static fromObject = ( object : { [ key : string ] : any } ) : TeacherRequestEntity => {
        const {
            id , id_user , status , about_you , category_ids , experience_level ,
            course_title , course_summary , created_at , portfolio_url , reviewed_at , rejection_reason
        } = object;

        if( !id_user ) throw 'El id del usuario es requerido.';
        if( !about_you ) throw 'Debes contarnos sobre vos.';
        if( !Array.isArray( category_ids ) || category_ids.length === 0 ) throw 'Debes seleccionar al menos una categoría.';
        if( !isExperienceLevel( experience_level ) ) throw 'Debes indicar tu nivel de experiencia.';
        if( !course_title ) throw 'Debes adjuntar un posible titulo que usarias para un curso.';
        if( !course_summary ) throw 'Debes adjuntar una descripción sobre los contenidos a enseñar.';
        if( !created_at ) throw 'La fecha de creación de la solicitud es requerida.';

        const parsedStatus = status ?? 'pending';
        if( !isTeacherRequestStatus( parsedStatus ) ) throw 'El estado de la solicitud no es válido.';

        return new TeacherRequestEntity({
            id,
            id_user,
            status : parsedStatus,
            about_you,
            category_ids,
            experience_level,
            course_title,
            course_summary,
            created_at,
            portfolio_url,
            reviewed_at,
            rejection_reason,
        });
    }
}
