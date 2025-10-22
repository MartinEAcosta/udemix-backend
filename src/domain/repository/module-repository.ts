import { CreateModuleDto } from '../dtos/module/create-module.dto';
import { ModuleResponsePopulatedDto } from '../dtos/module/module.response.dto';
import { UpdateModuleDto } from '../dtos/module/update-module.dto';
import { ModuleEntity } from '../entities/module.entity';
import { TransactionSession } from '../services/UnitOfWork';


export abstract class ModuleRepository {

    abstract createModule( createModuleDto : CreateModuleDto ) : Promise<ModuleEntity>; 
    abstract updateModule( updateModuleDto : UpdateModuleDto ) : Promise<ModuleEntity | null>;
    abstract deleteModule( id : string ) : Promise<boolean>;
    abstract addLessonToModule( id_lesson : string , module : ModuleEntity , ts : TransactionSession ) : Promise<boolean>;
    abstract findAllModules( ) : Promise<ModuleEntity[]>;
    abstract findModulesByCourseId( id_course : string ) : Promise<ModuleEntity[]>;
    abstract findModulesByCourseIdPopulated( id_course : string ) : Promise<ModuleResponsePopulatedDto[]>;
    abstract findModuleById( id : string ) : Promise<ModuleEntity | null>;

}