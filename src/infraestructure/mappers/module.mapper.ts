import { IModuleModel } from "../../data/mongo/models/module.model";
import { ModuleResponseDto } from "../../domain/dtos/module/module.response.dto";

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
}