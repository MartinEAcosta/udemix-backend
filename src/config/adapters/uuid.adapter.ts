import { v4 as uuidv4} from 'uuid';
import { IdGenerator } from '../../domain/services/IdGenerator';

export class UuidAdapter implements IdGenerator {

    generateId(): string {
        return uuidv4();
    }
}