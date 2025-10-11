import { ModuleDatasource } from '../../domain/datasources/module.datasource';



export class ModuleDatasourceImpl implements ModuleDatasource{

    async createModule ( createModuleDto : any ) : Promise<any> {
        throw new Error('Method not implemented.');
    }
    async deleteModule ( id : string ) : Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    async findAllModulesOfCourse ( id_course : string ) : Promise<any> {
        throw new Error('Method not implemented.');
    }
    async findModuleFromCourse ( unit : number ) : Promise<any | null> {
        throw new Error('Method not implemented.');
    }
    async findModuleById (id : string ) : Promise<any> {
        throw new Error('Method not implemented.');
    }

}