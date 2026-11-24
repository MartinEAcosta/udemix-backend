
/**
 * Lo único que algún flujo cambia de una inscripción: el avance.
 *
 * Era una interfaz sin validación (`UpdateEnrollmentRequestDTO`) y su único productor le pasaba
 * una `EnrollmentEntity` entera al datasource, así que viajaban también la identidad
 * (`id_user`, `id_course`) y el timestamp `purchaseDate`. Como clase con constructor privado, lo
 * que llega al update sólo puede haber salido del factory.
 *
 * Nombre normalizado al convenio del repo (`PascalCase` + `Dto`), ver CLAUDE.md.
 */
export class UpdateEnrollmentDto {

    private constructor(
        public readonly id                : string,
        public readonly progress         ?: number,
        public readonly completed_lessons ?: string[],
    ) { }

    /** Uso interno (MarkLessonAsCompleted). */
    static progressUpdate = (
        id : string,
        progress : number,
        completed_lessons : string[],
    ) : UpdateEnrollmentDto => {
        return new UpdateEnrollmentDto( id , progress , completed_lessons );
    }
}
