/**
 * Copia de `source` únicamente las claves de `keys`.
 *
 * Pensado para armar el objeto de un `$set`: la lista de claves ES la whitelist de lo que ese
 * update puede escribir, sin importar qué propiedades traiga de más el objeto que llegó.
 *
 * Hace falta porque el type check no alcanza: TypeScript no aplica excess property check a las
 * propiedades spreadeadas, así que pasar una entidad entera con `{ ...entity }` compila igual.
 * Eso es lo que permite que un campo que sólo debe mutar por un operador atómico
 * (`current_enrolled` vía `$inc`, `id_lessons` vía `$addToSet`) o por un método dedicado
 * (`id_file`/`avatar_url` vía `updateUserAvatar`) termine pisado por un update genérico.
 *
 * No filtra los `undefined` a propósito: Mongoose ya descarta esas claves de los updates, así
 * que un campo ausente en el origen queda sin tocar en el documento.
 */
export const pickFields = <T extends object , K extends keyof T>(
    source : T,
    keys   : readonly K[],
) : Partial<Pick<T , K>> => {
    const picked : Partial<Pick<T , K>> = {};
    for( const key of keys ) picked[ key ] = source[ key ];
    return picked;
};
