import { ExperienceLevel, isExperienceLevel } from "../../entities/teacher-request.entity";
import { regularExps } from "../../helpers/regular.exp";

export class CreateTeacherRequestDto {

    private constructor(
        public readonly id_user          : string,
        public readonly about_you        : string,
        public readonly category_ids     : string[],
        public readonly experience_level : ExperienceLevel,
        public readonly course_title     : string,
        public readonly course_summary   : string,
        public readonly portfolio_url    : string | null,
    ){ }

    static create = ( props : { [ key : string ] : any } ) : [ string? , CreateTeacherRequestDto? ] => {
        const { id_user , about_you , category_ids , experience_level , course_title , course_summary , portfolio_url } = props;

        if( !id_user ) return [ 'El id del usuario es requerido.' , undefined ];
        if( typeof id_user !== 'string' || !regularExps.isValidId.test( id_user ) ){
            return [ 'El id del usuario no es válido.' , undefined ];
        }

        if( typeof about_you !== 'string' || about_you.trim().length === 0 ){
            return [ 'Debes contarnos sobre vos.' , undefined ];
        }

        if( !Array.isArray( category_ids ) || category_ids.length === 0 ){
            return [ 'Debes seleccionar al menos una categoría.' , undefined ];
        }
        const hasInvalidCategory = category_ids.some(
            ( id : any ) => typeof id !== 'string' || !regularExps.isValidId.test( id )
        );
        if( hasInvalidCategory ) return [ 'Alguna de las categorías seleccionadas no es válida.' , undefined ];

        if( !isExperienceLevel( experience_level ) ) return [ 'Debes indicar tu nivel de experiencia.' , undefined ];

        if( typeof course_title !== 'string' || course_title.trim().length === 0 ){
            return [ 'Debes adjuntar un posible titulo que usarias para un curso.' , undefined ];
        }

        if( typeof course_summary !== 'string' || course_summary.trim().length === 0 ){
            return [ 'Debes adjuntar una descripción sobre los contenidos a enseñar.' , undefined ];
        }

        let parsedPortfolioUrl : string | null = null;
        if( portfolio_url !== undefined && portfolio_url !== null && String( portfolio_url ).trim().length > 0 ){
            if( typeof portfolio_url !== 'string' ) return [ 'El portfolio debe ser una url válida.' , undefined ];
            parsedPortfolioUrl = portfolio_url.trim();
        }

        return [ undefined , new CreateTeacherRequestDto(
                                    id_user,
                                    about_you.trim(),
                                    category_ids,
                                    experience_level,
                                    course_title.trim(),
                                    course_summary.trim(),
                                    parsedPortfolioUrl,
                                )
        ];
    }
}
