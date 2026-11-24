
/**
 * Metadata editable de un curso. Declara exactamente lo que el update genérico puede escribir,
 * así que la forma del DTO ES la whitelist y no hace falta filtrar nada en persistencia.
 *
 * Deliberadamente afuera:
 *  - `id_file` / `thumbnail_url`: los escribe CourseDatasource.setCourseThumbnail, en un solo
 *    $set, para que el FK y su copia desnormalizada no se separen.
 *  - `id_owner`: no existe feature de transferencia de propiedad.
 *  - `current_enrolled`: sólo se mueve con el $inc de saveEnrollment.
 */
export class UpdateCourseDto {

    private constructor(
        public readonly id : string,
        public readonly price ?: number,
        public readonly capacity ?: number | null,
        public readonly title ?: string,
        public readonly description ?: string,
        public readonly id_category ?: string,
        public readonly category_name ?: string,
    ){}


    // `capacity` NO lleva default: con `= null`, cualquier update que la omitiera le borraba el
    // cupo al curso (null sí se escribe, undefined lo descarta Mongoose) y además dejaba muerto
    // al guard de abajo, porque capacity nunca podía ser undefined acá adentro.
    // Mandar `capacity: null` explícito sigue funcionando: así se marca un curso sin límite.
    static create = ( id : string, props: { [ key:string ] : any } ) : [ string? , UpdateCourseDto? ] => {
        const { title, description, id_category, category_name , price, capacity } = props;

        if( capacity !== undefined && capacity !== null && isNaN( capacity ) ){
            return [ 'La capacidad debe ser un número válido o nulo.' , undefined ];
        }

        return [ undefined, new UpdateCourseDto(
                                                id,
                                                price,
                                                capacity,
                                                title,
                                                description,
                                                id_category,
                                                category_name,
                                            )
                ];
    }

    /**
     * Uso interno (UpdateCourse): el nombre de la categoría no se toma del body, se resuelve
     * desde la categoría que el use-case ya validó. Existe como factory para que el use-case no
     * tenga que spreadear el DTO a un objeto plano y pueda seguir pasando un UpdateCourseDto.
     */
    static withCategoryName = ( base : UpdateCourseDto , category_name : string ) : UpdateCourseDto => {
        return new UpdateCourseDto(
            base.id,
            base.price,
            base.capacity,
            base.title,
            base.description,
            base.id_category,
            category_name,
        );
    }
}
