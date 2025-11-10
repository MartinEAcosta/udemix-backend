import { IModulePopulatedModel, ModuleModel } from '../../data/mongo/models/module.model';
import { ModuleDatasource } from '../../domain/datasources/module-datasource';
import { CreateModuleDto } from '../../domain/dtos/module/create-module.dto';
import { ModuleResponseDto, ModuleResponsePopulatedDto } from '../../domain/dtos/module/module.response.dto';
import { UpdateModuleDto } from '../../domain/dtos/module/update-module.dto';
import { ModuleEntity } from '../../domain/entities/module.entity';
import { TransactionSession } from '../../domain/services/UnitOfWork';
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

        return hasDeleted ? true : false;
    }
    
    async addLessonToModule( id_lesson: string , module : ModuleEntity , ts ?: TransactionSession ) : Promise<boolean> {
        
        const session = ts?.getSession();

        // $addToSet se encarga de persistir los valores actuales y agregar uno al final.
        const moduleUpdated = await ModuleModel.findOneAndUpdate({ _id: module.id }, {$addToSet: { id_lessons : id_lesson }} , {new : true, session}  );
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

    async findModulesByCourseIdPopulated ( id_course : string ) : Promise<ModuleResponsePopulatedDto[]> {
        const modules = await ModuleModel.find({ id_course : id_course })
                                            .sort({ unit : 'asc'})
                                            .populate<IModulePopulatedModel>('id_lessons');
        console.log(modules)
        if( !modules ) return [];

        return modules.map( ModuleMapper.fromModuleResponsePopulatedDto );
    }
    
    
    async findModuleById ( id : string ) : Promise<ModuleResponseDto | null> {
        const module = await ModuleModel.findOne({ _id: id });
        if( !module ) return null;

        return ModuleMapper.fromModuleResponseDto( module );
    }

}