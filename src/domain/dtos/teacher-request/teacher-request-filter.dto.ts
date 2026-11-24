import { isTeacherRequestStatus, TeacherRequestStatus } from "../../entities/teacher-request.entity";
import { regularExps } from "../../helpers/regular.exp";

/**
 * Filtro de intención para el listado de solicitudes de profesor.
 * Representa lo que el cliente pidió, no cómo se consulta la base de datos:
 * la traducción a una query concreta vive en infraestructura.
 */
export class TeacherRequestFilterDto {

    private constructor(
        public readonly status  ?: TeacherRequestStatus,
        public readonly id_user ?: string,
    ){ }

    static create = ( props : { [ key : string ] : any } = {} ) : [ string? , TeacherRequestFilterDto? ] => {
        const { status , id_user } = props;

        let parsedStatus : TeacherRequestStatus | undefined = undefined;
        if( status !== undefined ){
            if( !isTeacherRequestStatus( status ) ) return [ 'El estado de la solicitud no es válido.' , undefined ];
            parsedStatus = status;
        }

        let parsedIdUser : string | undefined = undefined;
        if( id_user !== undefined ){
            if( typeof id_user !== 'string' || !regularExps.isValidId.test( id_user ) ){
                return [ 'El id del usuario no es válido.' , undefined ];
            }
            parsedIdUser = id_user;
        }

        return [ undefined , new TeacherRequestFilterDto( parsedStatus , parsedIdUser ) ];
    }
}
