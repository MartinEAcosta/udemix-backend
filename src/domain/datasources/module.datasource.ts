import { CreateModuleDto } from '../dtos/module/create-module.dto';
import { ModuleResponseDto } from '../dtos/module/module.response.dto';

export abstract class ModuleDatasource {
    
    abstract createModule( createModuleDto : CreateModuleDto ) : Promise<ModuleResponseDto>;
    abstract deleteModule( id : string ) : Promise<boolean>;
    abstract findAllModules( ) : Promise<any>;
    abstract findModulesByCourseId( id_course : string ) : Promise<ModuleResponseDto[]>;
    abstract findModuleFromCourse( unit : number ) : Promise<any | null>;
    abstract findModuleById( id : string ) : Promise<any>;
    
}