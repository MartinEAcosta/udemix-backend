import { UpdateModuleDto } from "../../dtos/module/update-module.dto";
import { ModuleEntity } from "../../entities/module.entity";
import { CustomError } from "../../errors/custom-error";
import { CourseRepository } from "../../repository/course-repository";
import { ModuleRepository } from "../../repository/module-repository";

interface UpdateModuleUseCase {
    execute( updateModuleDto : UpdateModuleDto , id_user : string ) : Promise<ModuleEntity>;
}

export class UpdateModule implements UpdateModuleUseCase {

    constructor( 
        private readonly moduleRepository : ModuleRepository,
        private readonly courseRepository : CourseRepository,
    ) { }

    async execute ( updateModuleDto : UpdateModuleDto , id_user : string ) : Promise<ModuleEntity> {
         
        const module = await this.moduleRepository.findModuleById( updateModuleDto.id );
        if( !module ) throw CustomError.notFound('El modulo que intentas modificar no se ha encontrado.');

        const course = await this.courseRepository.findCourseById( module.id_course );
        if( !course ) throw CustomError.notFound('No se encontro el curso al que intentas modificar el modulo.');

        if( id_user != course.id_owner ) throw CustomError.unauthorized('No puedes modificar un modulo en donde el curso no te pertenece');

        const updatedModule = await this.moduleRepository.updateModule( {
                                                                            ...updateModuleDto,
                                                                            id_course : course.id
                                                                        } 
                                                                    );
        if(!updatedModule) throw CustomError.internalServer('Hubo un error inesperado al intentar actualizar el modulo');

        return updatedModule;
    }
}
