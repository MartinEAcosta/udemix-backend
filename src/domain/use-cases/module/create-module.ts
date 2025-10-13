import { CreateModuleDto } from "../../dtos/module/create-module.dto";
import { ModuleEntity } from '../../entities/module.entity';
import { CustomError } from "../../errors/custom-error";
import { CourseRepository } from "../../repository/course-repository";
import { ModuleRepository } from "../../repository/module-repository";

interface CreateModuleUseCase{ 
    execute ( createModuleDto : CreateModuleDto , id_user : string ) : Promise<ModuleEntity>;
}

const validUnit = ( modules : ModuleEntity[] ) : number => {
    if( modules.length === 0) return 1;
    const last = modules.pop();
    return last ? last.unit+1 : 1;
}

export class CreateModule implements CreateModuleUseCase {

    constructor( 
        private readonly moduleRepository : ModuleRepository,
        private readonly courseRepository : CourseRepository,
    ) { }

    async execute( createModuleDto : CreateModuleDto , id_user : string ) : Promise<ModuleEntity>{

        const course = await this.courseRepository.findCourseById( createModuleDto.id_course );
        if( !course ) throw CustomError.badRequest('El curso al que intentas asignar el modulo no existe.');
        if( course.id_owner != id_user ) throw CustomError.unauthorized('No puedes crear un modulo en un curso que no es tuyo.');

        const modules = await this.moduleRepository.findModulesByCourseId( createModuleDto.id_course );
        return await this.moduleRepository.createModule({
            ...createModuleDto,
            unit : validUnit( modules ),
        });
    }
}