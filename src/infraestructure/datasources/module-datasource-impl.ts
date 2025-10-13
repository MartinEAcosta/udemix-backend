import { ModuleModel } from '../../data/mongo/models/module.model';
import { ModuleDatasource } from '../../domain/datasources/module.datasource';
import { CreateModuleDto } from '../../domain/dtos/module/create-module.dto';
import { ModuleResponseDto } from '../../domain/dtos/module/module.response.dto';
import { UpdateModuleDto } from '../../domain/dtos/module/update-module.dto';
import { ModuleEntity } from '../../domain/entities/module.entity';
import { ModuleMapper } from '../mappers/module.mapper';

export class ModuleDatasourceImpl implements ModuleDatasource{
    
    async createModule ( createModuleDto : CreateModuleDto ) : Promise<ModuleResponseDto> {
        const moduleCreated = await ModuleModel.create( createModuleDto );
        
        return ModuleMapper.fromModuleResponseDto( moduleCreated );
    }

    async updateModule ( updateModuleDto : UpdateModuleDto ) : Promise<ModuleResponseDto | null> {
        const moduleUpdated = await ModuleModel.findOneAndUpdate({ _id : updateModuleDto.id } , updateModuleDto , { new : true });
        return moduleUpdated ? ModuleMapper.fromModuleResponseDto( moduleUpdated ) : null;
    }
    
    async deleteModule ( id : string ) : Promise<boolean> {
        const hasDeleted = await ModuleModel.findByIdAndDelete( id );

        return true;
    }
    
    async addLessonToModule( id_lesson: string , module : ModuleEntity ) : Promise<boolean> {
        
        const lessons = module.lesssons;

        lessons.push( id_lesson );
        // $addToSet se encarga de persistir los valores actuales y agregar uno al final.
        const moduleUpdated = await ModuleModel.findOneAndUpdate({ _id: module.id }, {$addToSet: {id_lessons : lessons}} , {new : true} );

        return moduleUpdated ? true : false;
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