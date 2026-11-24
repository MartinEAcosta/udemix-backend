import { FileResponseDto } from "../file/file-response.dto";

/**
 * Sin `create( props )` a propósito: el único factory es de uso interno de UploadSingle.
 */
export class SetLessonFileDto {

    private constructor(
        public readonly id_lesson : string,
        public readonly id_file   : string,
    ) { }

    /** Tras subir un archivo nuevo a la carpeta `lesson`. */
    static fromUploadedFile = ( id_lesson : string , file : FileResponseDto ) : SetLessonFileDto => {
        return new SetLessonFileDto( id_lesson , file.id );
    }
}
