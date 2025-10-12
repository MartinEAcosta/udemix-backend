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

    
    async deleteModule(id: string): Promise<boolean> {
        throw new Error('Method not implemented.');
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
    
}