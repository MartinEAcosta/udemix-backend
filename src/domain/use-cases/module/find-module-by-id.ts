import { ModuleEntity } from "../../entities/module.entity";
import { ModuleRepository } from "../../repository/module-repository";

interface FindModuleByIdUseCase {
    execute( id : string ) : Promise<ModuleEntity | null>;
}

export class FindModuleById implements FindModuleByIdUseCase {

    constructor( 
        private readonly moduleRepository : ModuleRepository,
    ) { }

    async execute( id : string ) : Promise<ModuleEntity | null> {
        const module = await this.moduleRepository.findModuleById( id );
        if( !module ) return null;

        return ModuleEntity.fromObject( module );
    }
}