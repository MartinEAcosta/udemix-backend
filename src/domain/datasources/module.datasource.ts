import { CreateModuleDto } from '../dtos/module/create-module.dto';
import { ModuleResponseDto } from '../dtos/module/module.response.dto';
import { UpdateModuleDto } from '../dtos/module/update-module.dto';
import { ModuleEntity } from '../entities/module.entity';

export abstract class ModuleDatasource {
    
    abstract createModule( createModuleDto : CreateModuleDto ) : Promise<ModuleResponseDto>;
    abstract updateModule( updateModuleDto : UpdateModuleDto ) : Promise<ModuleResponseDto | null>;
    abstract deleteModule( id : string ) : Promise<boolean>;
    abstract addLessonToModule( id_lesson : string , module : ModuleEntity ) : Promise<boolean>;
    abstract findAllModules( ) : Promise<ModuleResponseDto[]>;
    abstract findModulesByCourseId( id_course : string ) : Promise<ModuleResponseDto[]>;
    abstract findModuleById( id : string ) : Promise<ModuleResponseDto | null>;
    
}