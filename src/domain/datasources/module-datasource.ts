import { CreateModuleDto } from '../dtos/module/create-module.dto';
import { ModuleResponseDto, ModuleResponsePopulatedDto } from '../dtos/module/module.response.dto';
import { UpdateModuleDto } from '../dtos/module/update-module.dto';
import { ModuleEntity } from '../entities/module.entity';
import { TransactionSession } from '../services/UnitOfWork';

export abstract class ModuleDatasource {
    
    abstract createModule( createModuleDto : CreateModuleDto ) : Promise<ModuleResponseDto>;
    abstract updateModule( updateModuleDto : UpdateModuleDto ) : Promise<ModuleResponseDto | null>;
    abstract deleteModule( id : string ) : Promise<boolean>;
    abstract addLessonToModule( id_lesson : string , module : ModuleEntity , ts ?: TransactionSession ) : Promise<boolean>;
    abstract findAllModules( ) : Promise<ModuleResponseDto[]>;
    abstract findModulesByCourseId( id_course : string ) : Promise<ModuleResponseDto[]>;
    abstract findModulesByCourseIdPopulated( id_course : string ) : Promise<ModuleResponsePopulatedDto[]>;
    abstract findModuleById( id : string ) : Promise<ModuleResponseDto | null>;
    
}