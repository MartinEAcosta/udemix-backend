import { ModuleModel } from '../../data/mongo/models/module.model';
import { ModuleDatasource } from '../../domain/datasources/module.datasource';
import { ModuleResponseDto } from '../../domain/dtos/module/module.response.dto';
import { ModuleMapper } from '../mappers/module.mapper';

export class ModuleDatasourceImpl implements ModuleDatasource{
    
    async createModule ( createModuleDto : any ) : Promise<ModuleResponseDto> {
        const moduleCreated = await ModuleModel.create( createModuleDto );
        
        return ModuleMapper.fromModuleResponseDto( moduleCreated );
    }
    
    async deleteModule ( id : string ) : Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    
    async findAllModules ( ) : Promise<any> {
        throw new Error('Method not implemented.');
    }    
    
    async findModulesByCourseId ( id_course : string ) : Promise<ModuleResponseDto[]> {
        const modules = await ModuleModel.find({ id_course : id_course })
                                            .sort({ unit : 'asc'});

        return modules.map( module => ModuleMapper.fromModuleResponseDto( module ));
    }

    async findModuleFromCourse ( unit : number ) : Promise<any | null> {
        throw new Error('Method not implemented.');
    }
    
    async findModuleById (id : string ) : Promise<any> {
        throw new Error('Method not implemented.');
    }

}