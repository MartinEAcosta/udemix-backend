
export abstract class ModuleDatasource {
    
    abstract createModule( createModuleDto : any ) : Promise<any>;
    abstract deleteModule( id : string ) : Promise<boolean>;
    abstract findAllModulesOfCourse( id_course : string ) : Promise<any>;
    abstract findModuleFromCourse( unit : number ) : Promise<any | null>;
    abstract findModuleById( id : string ) : Promise<any>;
    
}