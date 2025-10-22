import { ModuleEntity } from "../../entities/module.entity";
import { CustomError } from "../../errors/custom-error";
import { ModuleRepository } from "../../repository";
import { CourseRepository } from '../../repository/course-repository';

interface FindModuleByCourseIdUseCase {
    execute ( id_course : string ) : Promise<ModuleEntity[]>;
}

export class FindModulesByCourseId implements FindModuleByCourseIdUseCase {

    constructor( 
        private readonly moduleRepository : ModuleRepository,
        private readonly courseRepository : CourseRepository,
    ){ }

    async execute( id_course : string ) : Promise<ModuleEntity[]> {

        const course = await this.courseRepository.findCourseById( id_course );
        if( !course ) throw CustomError.badRequest('Chequee el id del curso ingresado e intente nuevamente.');

        const modules = await this.moduleRepository.findModulesByCourseId( id_course );

        return modules;
    }

}