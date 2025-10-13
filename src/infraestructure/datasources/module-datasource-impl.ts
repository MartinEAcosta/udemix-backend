import { ModuleModel } from '../../data/mongo/models/module.model';
import { ModuleDatasource } from '../../domain/datasources/module.datasource';
import { CreateModuleDto } from '../../domain/dtos/module/create-module.dto';
import { ModuleResponseDto } from '../../domain/dtos/module/module.response.dto';
import { ModuleMapper } from '../mappers/module.mapper';

export class ModuleDatasourceImpl implements ModuleDatasource{
    
    async createModule ( createModuleDto : CreateModuleDto ) : Promise<ModuleResponseDto> {
        const moduleCreated = await ModuleModel.create( createModuleDto );
        
        return ModuleMapper.fromModuleResponseDto( moduleCreated );
    }
    
    async deleteModule ( id : string ) : Promise<boolean> {
        const hasDeleted = await ModuleModel.findByIdAndDelete( id );
        console.log(hasDeleted);
        return true;
    }
    
    async findAllModules ( ) : Promise<ModuleResponseDto[]> {
        const modules = await ModuleModel.find({});

        return modules.map( ModuleMapper.fromModuleResponseDto );
    }    
    
    async findModulesByCourseId ( id_course : string ) : Promise<ModuleResponseDto[]> {
        const modules = await ModuleModel.find({ id_course : id_course })
                                            .sort({ unit : 'asc'});
        if( !modules ) return [];

        return modules.map( ModuleMapper.fromModuleResponseDto );
    }
    
    async findModuleById ( id : string ) : Promise<ModuleResponseDto | null> {
        const module = await ModuleModel.findOne({ _id: id });
        if( !module ) return null;

        return ModuleMapper.fromModuleResponseDto( module );
    }

}