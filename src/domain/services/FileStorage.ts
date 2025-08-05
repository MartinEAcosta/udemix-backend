import { FileEntity } from "../entities/file.entity";


export abstract class FileStorage {

    abstract uploadFile( file : FileEntity , folder : string ) : Promise<boolean>;

}