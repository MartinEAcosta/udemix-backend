
interface UpdateModuleOptions {
    id         : string,
    title     ?: string,
    unit      ?: number,
    id_course ?: string,
}

/**
 * `id_lessons` queda deliberadamente afuera: el array se construye con el $addToSet de
 * ModuleDatasource.addLessonToModule. Cuando se leía del body, un cliente podía reemplazarlo
 * entero y huerfanar lecciones, sin ninguna validación.
 */
export class UpdateModuleDto {

    public readonly id         : string;
    public readonly title     ?: string;
    public readonly unit      ?: number;
    public readonly id_course ?: string;

    private constructor ( options : UpdateModuleOptions ) {
        const { id , title, unit , id_course }  = options;
        this.id = id;
        this.title = title;
        this.unit = unit;
        this.id_course = id_course;
    }

    static create = ( props : { [ key : string ] : any } ) : [ string?, UpdateModuleDto? ]  => {
        const { id , title , unit , id_course } = props;

        if( !id ) return ['El id que intentas actualizar no puede ser nulo.', undefined];
        if( !title ) return ['El titulo no puede estar vació.', undefined];
        if( title.length < 6 ) return ['El titulo debe contener más de 6 caracteres.', undefined];

        return [ undefined , new UpdateModuleDto( { id, title, unit, id_course } ) ];
    }

    /**
     * Uso interno (UpdateModule): el curso no se toma del body, se estampa desde el módulo que
     * el use-case ya encontró y cuya propiedad ya verificó.
     */
    static withCourse = ( base : UpdateModuleDto , id_course : string ) : UpdateModuleDto => {
        return new UpdateModuleDto({
            id        : base.id,
            title     : base.title,
            unit      : base.unit,
            id_course : id_course,
        });
    }
}
