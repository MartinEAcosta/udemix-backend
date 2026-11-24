import { isTeacherRequestStatus, TeacherRequestStatus } from "../../entities/teacher-request.entity";
import { optionalId, parseQueryParams, rejectIf } from "../../helpers/query-parsers";

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
        return parseQueryParams( () => {
            const { status } = props;
            rejectIf( status !== undefined && !isTeacherRequestStatus( status ) , 'El estado de la solicitud no es válido.' );

            const id_user = optionalId( props.id_user , 'El id del usuario no es válido.' );

            return new TeacherRequestFilterDto( status as TeacherRequestStatus | undefined , id_user );
        });
    }
}
