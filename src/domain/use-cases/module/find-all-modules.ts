import { ModuleEntity } from "../../entities/module.entity";
import { ModuleRepository } from "../../repository/module-repository";

interface FindAllModulesUseCase {
    execute ( ) : Promise<ModuleEntity[]>;
}

export class FindAllModules implements FindAllModulesUseCase {

    constructor( 
        private readonly moduleRepository : ModuleRepository,
    ) { }

    async execute ( ) : Promise<ModuleEntity[]>{
        const modules = this.moduleRepository.findAllModules();

        return modules;
    }
}