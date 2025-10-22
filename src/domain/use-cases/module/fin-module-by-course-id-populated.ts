import { CustomError } from "../../errors/custom-error";
import { ModuleRepository } from "../../repository";
import { CourseRepository } from '../../repository/course-repository';
import { ModuleResponsePopulatedDto } from '../../dtos/module/module.response.dto';

interface FindModuleByCoursePopulatedIdUseCase {
    execute ( id_course : string ) : Promise<ModuleResponsePopulatedDto[]>;
}

export class FindModulesByCourseIdPopulated implements FindModuleByCoursePopulatedIdUseCase {

    constructor( 
        private readonly moduleRepository : ModuleRepository,
        private readonly courseRepository : CourseRepository,
    ){ }

    async execute( id_course : string  ) : Promise<ModuleResponsePopulatedDto[]> {

        const course = await this.courseRepository.findCourseById( id_course );
        if( !course ) throw CustomError.badRequest('Chequee el id del curso ingresado e intente nuevamente.');

        const modules = await this.moduleRepository.findModulesByCourseIdPopulated( id_course );

        return modules;
    }

}