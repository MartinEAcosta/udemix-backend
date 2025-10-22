

export interface ModuleResponseDto {
    id : string,
    title : string,
    unit : number,
    lessons : string[],
    id_course : string,
}

export interface ModuleResponsePopulatedDto {
    id : string,
    id_course : string,
    title : string,
    unit  : number,
    lessons : 
        {
            id : string,
            title : string,
        }[],
    
}