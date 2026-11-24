import { regularExps } from "../../helpers/regular.exp";

/** Los únicos estados a los que puede moverse una solicitud al revisarla. */
export type TeacherRequestReviewStatus = 'approved' | 'rejected';

export class ReviewTeacherRequestDto {

    private constructor(
        public readonly id               : string,
        public readonly status           : TeacherRequestReviewStatus,
        public readonly rejection_reason : string | null,
        public readonly reviewed_at      : Date,
    ){ }

    static create = ( props : { [ key : string ] : any } ) : [ string? , ReviewTeacherRequestDto? ] => {
        const { id , status , rejection_reason } = props;

        if( !id ) return [ 'El id de la solicitud es requerido.' , undefined ];
        if( typeof id !== 'string' || !regularExps.isValidId.test( id ) ){
            return [ 'El id de la solicitud no es válido.' , undefined ];
        }

        if( status !== 'approved' && status !== 'rejected' ){
            return [ 'Al revisar una solicitud solo podés aprobarla o rechazarla.' , undefined ];
        }

        // El motivo solo tiene sentido en un rechazo: si se aprueba, se descarta.
        let parsedRejectionReason : string | null = null;
        if( status === 'rejected' ){
            if( typeof rejection_reason !== 'string' || rejection_reason.trim().length === 0 ){
                return [ 'Debes indicar el motivo del rechazo.' , undefined ];
            }
            parsedRejectionReason = rejection_reason.trim();
        }

        return [ undefined , new ReviewTeacherRequestDto(
                                    id,
                                    status,
                                    parsedRejectionReason,
                                    new Date(),
                                )
        ];
    }
}
