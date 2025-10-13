import { CreateModuleDto } from '../dtos/module/create-module.dto';
import { UpdateModuleDto } from '../dtos/module/update-module.dto';
import { ModuleEntity } from '../entities/module.entity';


export abstract class ModuleRepository {

    abstract createModule( createModuleDto : CreateModuleDto ) : Promise<ModuleEntity>; 
    abstract updateModule( updateModuleDto : UpdateModuleDto ) : Promise<ModuleEntity | null>;
    abstract deleteModule( id : string ) : Promise<boolean>;
    abstract findAllModules( ) : Promise<ModuleEntity[]>;
    abstract findModulesByCourseId( id_course : string ) : Promise<ModuleEntity[]>;
    abstract findModuleById( id : string ) : Promise<ModuleEntity | null>;

}