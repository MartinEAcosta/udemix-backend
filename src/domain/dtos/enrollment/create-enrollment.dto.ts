
export class CreateEnrollmentDto {

    private constructor( 
        public readonly id_user : string ,
        public readonly id_course : string,
        public readonly progress ?: number,
        public readonly purchaseDate ?: Date,
        public readonly completed_lessons ?: string[],
    ){}

    static create = ( props : {[ key : string ]: any} ) : [string? , CreateEnrollmentDto?] => {
        const { id_user , id_course , purchaseDate , progress , completed_lessons } = props;

        if( !id_user ) return ['Se necesita un usuario para asignar la inscripción.', undefined];
        if( !id_course ) return ['Se necesita un curso para asignar la inscripción.', undefined];

        return [ undefined , new CreateEnrollmentDto( id_user , id_course , purchaseDate , progress , completed_lessons )];
    }

}