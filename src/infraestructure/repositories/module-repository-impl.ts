import { ModuleDatasource } from '../../domain/datasources/module.datasource';
import { CreateModuleDto } from '../../domain/dtos/module/create-module.dto';
import { ModuleEntity } from '../../domain/entities/module.entity';
import { ModuleRepository } from '../../domain/repository/module-repository';

export class ModuleRepositoryImpl implements ModuleRepository{

    constructor(
        private readonly moduleDatasource : ModuleDatasource,
    ) { }

    async createModule( createModuleDto : CreateModuleDto ) : Promise<ModuleEntity> {
        try{
            const moduleCreated = await this.moduleDatasource.createModule( createModuleDto );

            return ModuleEntity.fromObject( moduleCreated );
        }
        catch(error){
            throw error;
        }
    }

    
    async deleteModule( id : string ) : Promise<boolean> {
        try{
            const hasDeleted = await this.moduleDatasource.deleteModule( id );
            
            return hasDeleted;
        }
        catch(error){
            throw error;
        }
    }

    async findAllModules(): Promise<ModuleEntity[]> {
        try{
            const modules = await this.moduleDatasource.findAllModules();

            return modules.map( ModuleEntity.fromObject ); 
        }
        catch(error){
            throw error;
        }
    }

    async findModulesByCourseId( id_course : string ) : Promise<ModuleEntity[]> {
        try{
            const modules = await this.moduleDatasource.findModulesByCourseId( id_course );
    
            return modules.map( ModuleEntity.fromObject );
        }
        catch(error){
            throw error;
        }
    }

    async findModuleById( id : string ) : Promise<ModuleEntity | null> {
        try{
            const module = await this.moduleDatasource.findModuleById( id );

            return module ? ModuleEntity.fromObject( module ) : null;
        }
        catch(error){
            throw error;
        }
    }
    
}