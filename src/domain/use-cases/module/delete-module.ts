import { CustomError } from "../../errors/custom-error";
import { CourseRepository } from "../../repository/course-repository";
import { ModuleRepository } from "../../repository/module-repository";

interface DeleteModuleUseCase {
    execute( id : string , id_user : string ) : Promise<boolean>;
}

export class DeleteModule implements DeleteModuleUseCase {
    
    constructor(
        private readonly moduleRepository : ModuleRepository,
        private readonly courseRepository : CourseRepository,
     ){ }

    async execute( id: string , id_user : string ) : Promise<boolean> {


        const moduleToDelete = await this.moduleRepository.findModuleById( id );
        if( !moduleToDelete ) throw CustomError.notFound('El modulo que quieres remover no existe.');

        const courseSearched = await this.courseRepository.findCourseById( moduleToDelete.id_course );
        if( !courseSearched ) throw CustomError.notFound('El modulo que intentas eliminar no esta asignado a ningun curso.');

        if( courseSearched.id_owner != id_user ) throw CustomError.unauthorized('No puedes eliminar un modulo de un curso que no te pertenece.');

        const deletedModule = await this.moduleRepository.deleteModule( id );
        return deletedModule;
    }
    
}