import { CourseRepository } from "../../repository/course-repository";

import { CustomError } from "../../errors/custom-error";

export interface DeleteCourseUseCase {
    execute( id : string, id_user : string, role : string ) : Promise<boolean>;
}

export class DeleteCourse implements DeleteCourseUseCase {

    constructor(
        private readonly courseRepository : CourseRepository,
    ) {}

    async execute(id: string, id_user : string, role : string): Promise<boolean> {
        const courseToRemove = await this.courseRepository.findCourseById( id );
        if(courseToRemove === null) throw CustomError.notFound(`El curso con el id: ${id}, no fue encontrado`);

        if( courseToRemove.id_owner != id_user && role !== 'admin' ) {
            throw CustomError.unauthorized('No puedes eliminar un curso que no te pertenece.');
        }

        const hasRemoved = await this.courseRepository.deleteCourse( id );
        return hasRemoved;
    }

}