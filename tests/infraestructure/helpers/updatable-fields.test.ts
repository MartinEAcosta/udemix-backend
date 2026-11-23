import { describe, expect, test } from '@jest/globals';

import { pickFields } from '../../../src/infraestructure/helpers/pick-fields';
import { UPDATABLE_USER_FIELDS } from '../../../src/infraestructure/datasources/auth-datasource-impl';
import { UpdateUserDto } from '../../../src/domain/dtos/auth/update-user-dto';

describe('pickFields y las listas de campos actualizables' , () => {

    test('should copy only the requested keys and ignore the rest' , () => {
        const source = { a : 1 , b : 2 , c : 3 };

        expect( pickFields( source , [ 'a' , 'c' ] ) ).toEqual({ a : 1 , c : 3 });
    });

    test('should keep a null value, which is a real write, unlike undefined' , () => {
        const source : { a : number | null , b ?: number } = { a : null , b : undefined };

        const picked = pickFields( source , [ 'a' , 'b' ] );

        // null se escribe, undefined lo descarta Mongoose: la distinción tiene que sobrevivir.
        expect( picked.a ).toBeNull();
        expect( picked.b ).toBeUndefined();
    });

    // Si alguien agrega un campo a UpdateUserDto y se olvida de la lista, el campo no persiste
    // y el bug es silencioso. Este test es el que avisa.
    test('UPDATABLE_USER_FIELDS should not drift from UpdateUserDto' , () => {
        const [ error , dto ] = UpdateUserDto.create({
            id : 'anyId' , first_name : 'a' , last_name : 'b' , email : 'a@b.co',
        });

        expect( error ).toBeUndefined();

        // Las parameter properties se asignan siempre en el constructor, así que todas las
        // claves existen como propiedades propias incluso cuando valen undefined.
        const dtoKeys = Object.keys( dto! ).filter( key => key !== 'id' ).sort();

        expect( [ ...UPDATABLE_USER_FIELDS ].sort() ).toEqual( dtoKeys );
    });

});
