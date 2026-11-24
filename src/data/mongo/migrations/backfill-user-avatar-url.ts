import { envs } from "../../../config/envs";
import { MongoDatabase } from "../../init";
import { UserModel } from "../models/user.model";

/**
 * Backfill de `users.avatar_url` a partir del `url` del File apuntado por `id_file`.
 *
 * Hasta ahora el avatar se derivaba en cada lectura poblando `id_file`; al pasar a persistirlo,
 * los usuarios ya existentes quedan sin el campo. Este script lo completa en una sola pasada
 * server-side, sin traer los documentos al proceso.
 *
 * Es idempotente: recalcula el valor desde `files` cada vez, así que correrlo dos veces deja
 * el mismo resultado. Los usuarios sin `id_file` no se tocan — el campo queda ausente y el
 * mapper lo resuelve como null.
 *
 * A diferencia del seed, NO aborta con NODE_ENV=production: producción es justamente el entorno
 * donde este backfill hace falta.
 *
 * Uso:
 *   npm run migrate:avatar-url
 *   npm run migrate:avatar-url -- --dry-run
 */

const isDryRun = process.argv.includes( '--dry-run' );

/** Etapas que resuelven el url del File relacionado y lo dejan en avatar_url. */
const resolveAvatarUrlStages = [
    { $match : { id_file : { $ne : null } } },
    { $lookup : {
        from : 'files', localField : 'id_file', foreignField : '_id', as : 'avatar_file',
        pipeline : [{ $project : { url : 1 } }],
    }},
    { $set : { avatar_url : { $ifNull : [ { $first : '$avatar_file.url' } , null ] } } },
    { $unset : 'avatar_file' },
];

const main = async () => {
    await MongoDatabase.connect({ dbUrl: envs.DB_CON, dbName: envs.DB_NAME });

    const candidates = await UserModel.countDocuments({ id_file : { $ne : null } });
    console.log( `Usuarios con id_file: ${ candidates }` );

    if( isDryRun ) {
        // Cuenta cuántos quedarían con un valor distinto al actual, sin escribir nada.
        const [ summary ] = await UserModel.aggregate([
            ...resolveAvatarUrlStages,
            { $group : {
                _id : null,
                total : { $sum : 1 },
                withUrl : { $sum : { $cond : [ { $ne : [ '$avatar_url' , null ] } , 1 , 0 ] } },
            }},
        ]);

        console.log( '--- dry-run: no se escribió nada ---' );
        console.log( `Usuarios alcanzados: ${ summary?.total ?? 0 }` );
        console.log( `Con url resuelta: ${ summary?.withUrl ?? 0 }` );
        console.log( `Con id_file colgado (File inexistente): ${ ( summary?.total ?? 0 ) - ( summary?.withUrl ?? 0 ) }` );
        return;
    }

    await UserModel.aggregate([
        ...resolveAvatarUrlStages,
        { $merge : { into : 'users' , on : '_id' , whenMatched : 'merge' , whenNotMatched : 'discard' } },
    ]);

    const filled = await UserModel.countDocuments({ avatar_url : { $ne : null } });
    console.log( `Usuarios con avatar_url resuelto: ${ filled }` );
    console.log( '--- Backfill completado ---' );
}

main()
    .catch( ( error ) => {
        console.error( 'El backfill de avatar_url falló:' , error );
        process.exitCode = 1;
    })
    .finally( async () => {
        // MongoDatabase.connection sólo existe si connect() llegó a resolver.
        await MongoDatabase.connection?.close();
    });
