
export class UpdateEnrollmentDto {

    private constructor(
        public readonly id                : string,
        public readonly progress         ?: number,
        public readonly completed_lessons ?: string[],
    ) { }

    /** Uso interno (MarkLessonAsCompleted). */
    static progressUpdate = ( id : string,  progress : number, completed_lessons : string[] ) : UpdateEnrollmentDto => {
        return new UpdateEnrollmentDto( id , progress , completed_lessons );
    }
}
