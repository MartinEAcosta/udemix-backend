import { FileResponseDto } from "../file/file-response.dto";

/**
 * NO expone un `create( props )`: los dos factories son de uso interno de los
 * use-cases de archivos, así que no existe ningún camino desde `req.body` hasta estos campos.
 */
export class SetCourseThumbnailDto {

    private constructor(
        public readonly id_course     : string,
        public readonly id_file       : string | null,
        public readonly thumbnail_url : string | null,
    ) { }

    /** Tras subir un archivo nuevo a la carpeta `course`. */
    static fromUploadedFile = ( id_course : string , file : FileResponseDto ) : SetCourseThumbnailDto => {
        return new SetCourseThumbnailDto( id_course , file.id , file.url ?? null );
    }

    /** Tras borrar la portada: limpia el FK y la copia a la vez, sin dejar referencia colgada. */
    static cleared = ( id_course : string ) : SetCourseThumbnailDto => {
        return new SetCourseThumbnailDto( id_course , null , null );
    }
}
