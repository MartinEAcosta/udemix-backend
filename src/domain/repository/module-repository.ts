import { CreateModuleDto } from '../dtos/module/create-module.dto';
import { ModuleEntity } from '../entities/module.entity';


export abstract class ModuleRepository {

    abstract createModule( createModuleDto : CreateModuleDto ) : Promise<ModuleEntity>; 
    abstract deleteModule( id : string ) : Promise<boolean>;
    abstract findAllModules( ) : Promise<ModuleEntity[]>;
    abstract findModulesByCourseId( id_course : string ) : Promise<ModuleEntity[]>; 

}