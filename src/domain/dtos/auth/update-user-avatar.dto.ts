import { FileResponseDto } from "../file/file-response.dto";

/**
 * Único shape con el que se puede escribir el avatar de un usuario.
 *
 * `id_file` y `avatar_url` viajan siempre juntos y se persisten en un solo $set, para que la
 * copia desnormalizada no pueda quedar desincronizada del File al que apunta el FK.
 *
 * Deliberadamente NO expone un `create( props )`: ambos factories son de uso interno de los
 * use-cases de archivos, igual que UpdateUserDto.markEmailVerified. Así no existe ningún camino
 * desde `req.body` hasta estos dos campos.
 */
export class UpdateUserAvatarDto {

    private constructor(
        public readonly id_user    : string,
        public readonly id_file    : string | null,
        public readonly avatar_url : string | null,
    ) { }

    /** Tras subir un archivo nuevo a la carpeta `user`. */
    static fromUploadedFile = ( id_user : string , file : FileResponseDto ) : UpdateUserAvatarDto => {
        return new UpdateUserAvatarDto( id_user , file.id , file.url ?? null );
    }

    /** Tras borrar el avatar: limpia el FK y la copia a la vez, sin dejar referencia colgada. */
    static cleared = ( id_user : string ) : UpdateUserAvatarDto => {
        return new UpdateUserAvatarDto( id_user , null , null );
    }
}
