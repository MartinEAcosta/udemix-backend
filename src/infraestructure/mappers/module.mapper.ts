import { IModuleModel, IModulePopulatedModel } from "../../data/mongo/models/module.model";
import { ModuleResponseDto, ModuleResponsePopulatedDto } from "../../domain/dtos/module/module.response.dto";

export class ModuleMapper {

    static fromModuleResponseDto( moduleDoc : IModuleModel ) : ModuleResponseDto {
        return {
            id: moduleDoc._id!.toString(),
            title: moduleDoc.title,
            unit: moduleDoc.unit,
            lessons: moduleDoc.id_lessons.map( lesson => lesson.toString() ),
            id_course: moduleDoc?.id_course.toString(),
        };
    }

    static fromModuleResponsePopulatedDto( moduleDoc : IModulePopulatedModel ) : ModuleResponsePopulatedDto {
        return {
            id: moduleDoc._id!.toString(),
            title: moduleDoc.title,
            unit: moduleDoc.unit,
            lessons: moduleDoc.id_lessons?.map( lesson => ({
                id: lesson._id!.toString(),
                title: lesson.title,
            }) ) || [],
            id_course: moduleDoc?.id_course.toString(),
        };
    }
}