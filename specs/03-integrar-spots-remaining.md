# 03 - Integrar el campo `spots_remaining` del curso

**Estado:** Aprobado
**Depende de:** ninguno
**Fecha:** 2026-10-29

**Objetivo:** Exponer `spots_remaining` en la API como **campo derivado en lectura** (`capacity - current_enrolled`, nunca persistido), dejando `current_enrolled` como el único contador de cupo en la base; incrementarlo atómicamente con guard de capacidad en los tres caminos que crean inscripciones, backfillear los cursos existentes, y validar cupo en el checkout antes de cobrar.

## Alcance

**Incluye:**

- **Revertir el campo persistido:** se quita `spots_remaining` del schema de `src/data/mongo/models/course.model.ts` (está agregado en el working copy, sin commitear). No entra a `ICourseModel`.
- **Derivación en lectura:** `CourseEntity.calculateSpotsRemaining( capacity , current_enrolled )` como única fórmula, usada por el constructor de `CourseEntity` y por los dos mappers de `CourseMapper`. Se agrega el campo a `CourseResponseDto` / `CoursePopulateOwnerResponseDto`.
- **Incremento atómico de `current_enrolled` con guard de cupo** en `EnrollmentDatasourceImpl.saveEnrollment`, con un `findOneAndUpdate` que filtra por capacidad disponible. Cubre los tres caminos que crean inscripciones (`EnrollUserInCourse`, `CreateOrder`, `FulfillPayment`) con un solo cambio. Hoy `current_enrolled` nunca se incrementa en runtime: solo lo setea `seed.ts:238`.
- **Arreglo del gap de transacción:** `EnrollmentDatasource.saveEnrollment` pasa a aceptar `ts ?: TransactionSession` y `EnrollmentRepositoryImpl.saveEnrollment` reenvía el `ts` que hoy recibe y descarta (declarado en `EnrollmentRepository:14`, ignorado en la impl). El `EnrollmentModel.create` y el update del curso corren con `{ session }`, de modo que en el flujo de balance la inscripción, el contador y el descuento de balance queden realmente en la misma transacción.
- **Validación de cupo agotado en el use-case de inscripción:** `EnrollUserInCourse` rechaza con `CustomError.badRequest` antes de abrir la transacción si `course.spots_remaining === 0`. El guard del `findOneAndUpdate` sigue siendo la defensa real contra la carrera entre inscripciones concurrentes.
- **Validación de cupo en el checkout:** `CreateOrder` rechaza con 400 si algún curso del carrito está completo, **antes** de crear el payment local y de llamar al gateway. Se corrige además el `saveEnrollment` sin `await` de `create-order.ts:60`, que hoy convertiría el throw del guard en una unhandled rejection.
- **Backfill de `current_enrolled`:** script one-off que recalcula el contador de cada curso desde `EnrollmentModel` y limpia el `spots_remaining` que haya quedado persistido en documentos viejos. Se corre una vez y se retira del repo: el código queda registrado en este spec (ver abajo), no como archivo permanente en `src/`.
- **Seed:** `src/data/mongo/seed.ts` queda igual (ya setea `current_enrolled` desde las enrollments seed en el paso de `seedEnrollments`). Solo se verifica que no escriba `spots_remaining`.

**No incluye:**

- **Persistir `spots_remaining`.** Ver Decisiones.
- **Índice para el filtro `notFullyEnrolled`.** El filtro sigue usando `$expr`, que no es indexable. Con el volumen actual (4 cursos seed, catálogo de un seminario) el collection scan no se mide. Ver Riesgos.
- **El filtro `category_name`** que está sin commitear en `src/domain/dtos/course/course-filter.dto.ts` (y que hoy devuelve el mensaje de error de `title` en vez de el de `category_name`, líneas 30-36). Es otro tema; se comitea o revierte por fuera de este spec.
- **Idempotencia de las inscripciones por webhook.** `CreateOrder` y `FulfillPayment` siguen creando enrollments duplicadas ante una redelivery (deuda ya documentada en `CLAUDE.md`); este spec no la resuelve, aunque ahora cada duplicado también mueve el contador.
- **Devolución de cupo al desinscribir.** No existe hoy un caso de uso de baja de inscripción, así que no hay camino de decremento.
- **Reembolso automático** si el cupo se agota entre el checkout y el `processed` de MercadoPago. La validación de `CreateOrder` cierra el caso común, no la carrera. Ver Riesgos.
- **Tests automatizados.** El repo no tiene cobertura de `course` ni `enrollment`, y los specs 01 y 02 verificaron a mano. Se verifica con `npm run build`, `npm test` sin regresiones y pruebas manuales.
- **Cambios en el frontend Angular** (repo aparte). El contrato de la API gana un campo, no pierde ninguno.

## Modelo de datos

No hay colecciones nuevas ni campos nuevos en la base. El schema de `course.model.ts` vuelve a lo que está commiteado:

```typescript
capacity : {
    type    : Number,
    default : null,
    min     : 0,
},

current_enrolled : {
    type    : Number,
    default : 0,
},
```

Semántica:

| Campo | Significado | Dónde vive | Quién lo escribe |
|---|---|---|---|
| `capacity` | Cupo total. `null`/ausente = ilimitado. | Mongo | El owner, vía create/update. |
| `current_enrolled` | Inscriptos actuales. Único contador. | Mongo | `saveEnrollment` (y el seed / el backfill). |
| `spots_remaining` | Cupo disponible. `null` = ilimitado, `0` = agotado. | Solo en la respuesta de la API | Nadie: se calcula al leer. |

Fórmula única, en `src/domain/entities/course.entity.ts`:

```typescript
/** Cupo disponible. null = ilimitado. Nunca se persiste: se deriva de capacity y current_enrolled. */
static calculateSpotsRemaining = ( capacity ?: number | null , current_enrolled ?: number | null ) : number | null => {
    if( capacity === null || capacity === undefined ) return null;
    return Math.max( 0 , capacity - ( current_enrolled ?? 0 ) );
}
```

En la entidad el campo tiene que ser una **propiedad propia asignada en el constructor**, no un getter de prototipo: los controllers serializan la entidad con `res.json(...)` y `JSON.stringify` ignora los getters del prototipo, así que un getter no llegaría al cliente.

```typescript
this.capacity = capacity;
this.current_enrolled = current_enrolled ?? 0;
this.spots_remaining = CourseEntity.calculateSpotsRemaining( this.capacity , this.current_enrolled );
```

Los dos mappers calculan lo mismo, porque `findCoursePopulatedById` devuelve el DTO sin pasar por la entidad (`course-datasource-impl.ts:51`):

```typescript
spots_remaining : CourseEntity.calculateSpotsRemaining( courseDoc.capacity , courseDoc.current_enrolled ),
```

Guard + incremento en `EnrollmentDatasourceImpl.saveEnrollment` — un solo `findOneAndUpdate` condicional:

```typescript
saveEnrollment = async( enrollmentRequestDTO : CreateEnrollmentRequestDTO , ts ?: TransactionSession ) : Promise<EnrollmentResponseDTO> => {
    const session = ts?.getSession();

    const course = await CourseModel.findOneAndUpdate(
        {
            _id : enrollmentRequestDTO.id_course,
            $or : [
                { capacity : { $exists : false } },
                { capacity : null },
                { $expr : { $lt : [ { $ifNull : [ "$current_enrolled" , 0 ] } , "$capacity" ] } },
            ],
        },
        { $inc : { current_enrolled : 1 } },
        { new : true , session },
    );
    if( !course ) throw CustomError.badRequest('El curso no existe o ya no tiene cupos disponibles.');

    const [ savedEnrollment ] = await EnrollmentModel.create( [ enrollmentRequestDTO ] , { session } );
    if( !savedEnrollment ) throw 'Hubo un error al registrar la inscripción.';

    return EnrollmentMapper.fromEnrollmentResponseDTO( savedEnrollment );
}
```

Dos detalles de Mongoose que importan:

- `Model.create( doc , options )` **no** acepta opciones con un documento suelto: hay que usar la forma de array (`create( [ doc ] , { session } )`) para que la sesión se respete.
- El `$or` del filtro tiene que contemplar `{ capacity : { $exists : false } }` además de `null`, porque los cursos creados antes de que existiera el campo no lo tienen.

El filtro `withNotFullyEnrolled` de `src/infraestructure/helpers/course-query-builder.ts` **no se toca**: ya expresa exactamente esta condición (`course-query-builder.ts:50-60`). Es la misma query que el guard, y conviene que sigan siendo idénticas.

Backfill (archivo temporal, p. ej. `src/data/mongo/backfill-current-enrolled.ts`, borrado tras la corrida):

```typescript
const counts = await EnrollmentModel.aggregate<{ _id : Types.ObjectId , total : number }>([
    { $group : { _id : '$id_course' , total : { $sum : 1 } } },
]);

// Cursos sin ninguna inscripción: el contador tiene que quedar en 0, no en lo que haya.
await CourseModel.updateMany(
    { _id : { $nin : counts.map( ( count ) => count._id ) } },
    { $set : { current_enrolled : 0 } },
);

if( counts.length ){
    await CourseModel.bulkWrite(
        counts.map( ( { _id , total } ) => ({
            updateOne : { filter : { _id } , update : { $set : { current_enrolled : total } } },
        })),
    );
}

// Limpia el campo abortado. Va por .collection porque spots_remaining ya no está en el schema
// y el modo strict de Mongoose descartaría el $unset.
await CourseModel.collection.updateMany(
    { spots_remaining : { $exists : true } },
    { $unset : { spots_remaining : '' } },
);
```

Se corre con `ts-node` directo (`node_modules/.bin/ts-node <archivo>`), sin agregar nada a `package.json`: es una corrida única, no un comando del proyecto. El script conecta con `MongoDatabase.connect` (mismo patrón que `seed.ts`), loguea cuántos cursos tocó y cierra la conexión. Es idempotente: correrlo dos veces da el mismo resultado.

## Plan de implementación

1. **Revertir el schema:** quitar el bloque `spots_remaining` de `src/data/mongo/models/course.model.ts` (líneas 75-79 del working copy). `ICourseModel` queda como está. Compilar.
2. **Fórmula + exposición del campo** (sin cambio de comportamiento de escritura):
   - `src/domain/entities/course.entity.ts`: agregar el `static calculateSpotsRemaining`, la propiedad pública `spots_remaining : number | null` y su asignación en el constructor (después de `capacity` y `current_enrolled`). No se agrega a `CourseEntityOptions` ni al desestructurado de `fromObject`: no es un input.
   - `src/domain/dtos/course/course.responses.ts`: `spots_remaining : number | null` en `CourseResponseDto` y en `CoursePopulateOwnerResponseDto`.
   - `src/infraestructure/mappers/course.mapper.ts`: calcular el campo en `fromCourseResponseDto` y en `fromCoursePopulateOwnerResponseDto`.
   - Compilar. A esta altura la API ya devuelve `spots_remaining` (todavía calculado contra un `current_enrolled` desactualizado, que el paso 7 arregla).
3. **Validar `capacity` en la creación:** `src/domain/dtos/course/create-course.dto.ts` hoy no valida nada de `capacity` y la declara `capacity : number` (sin `null`). Pasa a `capacity ?: number | null` y `create()` rechaza `'La capacidad debe ser un número válido o nulo.'` si no es numérica, y `'La capacidad no puede ser negativa.'` si es `< 0`. Mismo criterio que ya aplica `UpdateCourseDto:22`.
4. **Plumbing de la sesión de transacción:**
   - `src/domain/datasources/enrollment-datasource.ts`: `saveEnrollment( enrollmentRequestDTO : CreateEnrollmentRequestDTO , ts ?: TransactionSession )`.
   - `src/infraestructure/repositories/enrollment-repository-impl.ts`: aceptar `ts ?: TransactionSession` y reenviarlo al datasource.
   - `src/infraestructure/datasources/enrollment-datasource-impl.ts`: usar `{ session : ts?.getSession() }` en el `EnrollmentModel.create`, en la forma de array.
5. **Guard de cupo + incremento:** en `EnrollmentDatasourceImpl.saveEnrollment`, antes de crear la inscripción, el `findOneAndUpdate` del bloque de arriba. Importar `CourseModel` y `CustomError`. Los pasos 4 y 5 van juntos: el cambio de firma y su uso.
6. **Validaciones previas en los dos puntos de entrada:**
   - `src/domain/use-cases/enrollment/enroll-user-in-course.ts`: después de la validación de `alreadyEnrolled`, `if( course.spots_remaining === 0 ) throw CustomError.badRequest('El curso no tiene cupos disponibles.')`.
   - `src/domain/use-cases/order/create-order.ts`: en el `for` que ya recorre el carrito y recalcula el precio (líneas 31-36), agregar el mismo rechazo con el título del curso en el mensaje. Y agregar el `await` faltante en el `saveEnrollment` de la línea 60.

     ```typescript
     if( course.spots_remaining === 0 ){
         throw CustomError.badRequest( `El curso "${ course.title }" no tiene cupos disponibles.` );
     }
     ```
7. **Backfill:** crear el script del bloque de arriba como archivo temporal, correrlo contra la base con `ts-node`, verificar el contador, y **borrar el archivo**. No queda en `src/` (se compilaría a `dist/` y viajaría en la imagen Docker) ni en `package.json`.
8. **Verificación:** `npm run build`, `npm test`, `npm run seed`, y las pruebas manuales de los criterios de aceptación.

Los pasos 1 a 3 dejan el sistema compilando y funcional por separado. Los pasos 4 y 5 están acoplados. Los pasos 6 y 7 son independientes entre sí, pero el 7 conviene correrlo último (el guard del paso 5 depende de que el contador sea confiable para no bloquear inscripciones de más).

## Criterios de aceptación

- [ ] `npm run build` compila sin errores y `npm test` pasa sin regresiones.
- [ ] El schema de `course.model.ts` **no** tiene `spots_remaining`, y ningún documento de `courses` lo tiene después del backfill (`db.courses.find({ spots_remaining : { $exists : true } })` devuelve vacío).
- [ ] `GET /api/courses/:id`, `GET /api/courses` y el endpoint que devuelve el curso con owner poblado devuelven `spots_remaining` en el payload.
- [ ] Un curso con `capacity: 10` y `current_enrolled: 3` devuelve `spots_remaining: 7`.
- [ ] Un curso con `capacity: null` (o sin el campo) devuelve `spots_remaining: null`.
- [ ] Un curso con `capacity: 1` y `current_enrolled: 4` devuelve `spots_remaining: 0`, no un negativo.
- [ ] `POST /api/courses` con `capacity: "diez"` responde 400 y no crea nada. Con `capacity: -1` también.
- [ ] `POST /api/courses` sin `capacity` crea el curso y lo devuelve con `spots_remaining: null`.
- [ ] `PUT /api/courses/:id` con `capacity: 5` sobre un curso con `current_enrolled: 2` devuelve `spots_remaining: 3` sin que haya que tocar ningún contador.
- [ ] Inscribir un usuario por balance (`POST /api/enrollments`) en un curso con `capacity: 10` y `current_enrolled: 0` deja `current_enrolled: 1` en Mongo y la respuesta del curso pasa a `spots_remaining: 9`.
- [ ] Inscribir en un curso completo (`current_enrolled === capacity`) responde 400 con mensaje de cupo agotado, y **no** crea la inscripción ni descuenta balance.
- [ ] Inscribir en un curso con `capacity: null` (o sin el campo, curso preexistente) funciona e incrementa `current_enrolled`.
- [ ] Una compra por MercadoPago que llega a `processed` (vía `CreateOrder` o vía el webhook `FulfillPayment`) incrementa `current_enrolled` de cada curso comprado.
- [ ] `POST /api/orders` con un curso completo en el carrito responde 400, **no** crea el `Payment` local y **no** llega a MercadoPago (verificable en el panel del gateway o con un log).
- [ ] `GET /api/courses?notFullyEnrolled=true` excluye los cursos con `current_enrolled >= capacity` e incluye los de `capacity` nula, ausente, o con cupo libre.
- [ ] Si la transacción de `EnrollUserInCourse` aborta (p. ej. forzando un fallo en `updateUser`), el curso **no** queda con `current_enrolled` incrementado y la inscripción no existe.
- [ ] Tras correr el backfill, el `current_enrolled` de cada curso coincide con `db.enrollments.countDocuments({ id_course : <id> })`. Correrlo dos veces seguidas no cambia nada.
- [ ] El backfill no deja rastro en el repo: no hay archivo de backfill en `src/` ni script en `package.json` (`git diff -- package.json` vacío).
- [ ] Tras `npm run seed`, cada curso seed tiene `current_enrolled` igual a la cantidad de enrollments seed de ese curso.

## Decisiones tomadas y descartadas

- **`spots_remaining` derivado en lectura, no persistido.** Es información redundante: `capacity - current_enrolled`. Persistirlo agrega un segundo contador sobre uno que ya es un cache de `countDocuments(enrollments)`, con la invariante teniendo que mantenerse en cada write path. Y la invariante nace rota: bajar `capacity` por debajo de `current_enrolled` obliga a clampear a 0, con lo cual `spots_remaining !== capacity - current_enrolled` y pasan a existir dos definiciones del mismo campo. Derivarlo deja una sola fuente de verdad, sin drift posible y sin backfill del campo.
- **`current_enrolled` es el contador que se queda, no `spots_remaining`.** Es el único que sobrevive al cupo ilimitado: si `capacity` es `null`, `spots_remaining` es `null` y de ahí no sale la cantidad de inscriptos. Al revés sí funciona.
- **El guard atómico no necesita el campo persistido.** `$expr` es válido en el filtro de `findOneAndUpdate`, así que `{ $expr : { $lt : [ "$current_enrolled" , "$capacity" ] } }` da la misma atomicidad y la misma protección contra sobreventa que un `{ spots_remaining : { $gt : 0 } }`. Lo único que se pierde es la indexabilidad del filtro. Se descartó la versión persistida porque además pedía un `findOneAndUpdate` con pipeline de agregación (Mongo 4.2+) y `$cond`/`$ifNull` para no reventar con `Cannot apply $inc to a value of non-numeric type` sobre los cursos de cupo ilimitado: más maquinaria para mantener dos contadores en lugar de uno.
- **El índice no justifica el campo hoy.** `spots_remaining` persistido solo aportaba una query indexable para `notFullyEnrolled`. Con el catálogo actual el scan no se nota. Si el volumen crece a decenas de miles de cursos, se agrega el contador persistido en ese momento, como optimización medida, con el mismo write path que este spec deja centralizado en un único lugar.
- **El incremento vive en `EnrollmentDatasourceImpl.saveEnrollment`, no en los use-cases.** Hay tres caminos que crean inscripciones (`EnrollUserInCourse`, `CreateOrder:60`, `FulfillPayment:34`) y los dos de pago no pasan por el use-case de inscripción. Ponerlo en el datasource los cubre con un cambio y evita que el próximo flujo se olvide del contador. Se descartó repetir la llamada en los tres use-cases (lógica duplicada) y dejarlo solo en `EnrollUserInCourse` (las compras pagas quedarían con el contador desincronizado).
- **Guard en el filtro del update, además del chequeo en los use-cases.** Los chequeos previos en `EnrollUserInCourse` y `CreateOrder` existen por el mensaje de error y por no cobrar de más, pero no protegen de la carrera: dos requests concurrentes pueden leer el mismo `current_enrolled`. El guard en el filtro sí.
- **Plumbear `ts` hasta el datasource de enrollment.** `EnrollmentRepositoryImpl.saveEnrollment` hoy recibe el `ts` declarado en `EnrollmentRepository:14` y lo descarta, así que la "transacción" de `EnrollUserInCourse` nunca cubrió la inscripción. Si el incremento del contador quedaba fuera de la sesión, un abort posterior dejaba el cupo consumido sin inscripción. Se arregla acá porque este spec es el que introduce la escritura que lo hace visible.
- **La propiedad derivada se asigna en el constructor, no es un getter.** Un `get spots_remaining()` vive en el prototipo y `JSON.stringify` lo ignora, así que el campo no llegaría a la respuesta HTTP (los controllers serializan la entidad directo). La fórmula igual queda en un solo lugar, como `static`.
- **`capacity` menor que `current_enrolled` se permite, con `spots_remaining` clampeado a 0.** Bajar el cupo es la forma natural de cerrar un curso a nuevas inscripciones; rechazarlo con 400 impediría ese caso legítimo. Los ya inscriptos no se tocan, y el guard impide que entren más.
- **Backfill sí, aunque el campo sea derivado.** Como `current_enrolled` nunca se incrementó en runtime, los cursos de la base real tienen 0 con inscripciones existentes. Antes eso solo ensuciaba el filtro `notFullyEnrolled`; ahora la API publica un cupo disponible inflado y el guard deja entrar gente de más. Un script de ~30 líneas corrido una vez lo cierra, y queda disponible para re-sincronizar si el contador se vuelve a desviar (p. ej. por las enrollments duplicadas del webhook).
- **Se descartó contar con `countDocuments` en la lectura de cursos.** Da el dato exacto sin contador, pero mete una query por curso en el listado paginado y deja al guard atómico sin nada contra qué comparar en el documento.
- **Validar cupo en `CreateOrder`.** Sin esa validación, comprar un curso ya completo cobra el pago y después falla la inscripción contra el guard, dentro de un `FulfillPayment` fire-and-forget cuyo error se pierde en el log. La validación no elimina la carrera (el cupo puede agotarse mientras el pago se procesa), pero cierra el caso frecuente: el curso ya estaba lleno al momento de comprar.
- **`spots_remaining` nunca se acepta del body.** No existe como campo de escritura en ningún DTO. Mismo criterio que ya usa el checkout (`CLAUDE.md`: los precios de los items se recalculan server-side y se ignoran los del cliente).
- **El filtro `category_name` del working copy queda fuera.** Es un cambio sin commitear de otro tema (con un bug propio: devuelve el mensaje de error de `title`). Mezclarlo haría un spec de dos features.
- **Sin tests automatizados.** Consistente con el repo (no hay cobertura de `course` ni `enrollment`) y con los specs 01 y 02, que verificaron a mano. Se compensa con criterios de aceptación concretos y verificables uno por uno.

## Riesgos

- **El filtro `notFullyEnrolled` no es indexable.** `$expr` fuerza a evaluar la expresión documento por documento. Irrelevante con el catálogo actual; si el listado de cursos empieza a aparecer en los tiempos de respuesta, la salida es el contador persistido (ver Decisiones), no cambiar la fórmula.
- **Webhook redelivery duplica el consumo de cupo.** La falta de idempotencia ya documentada en `CLAUDE.md` duplica enrollments; ahora cada duplicado también suma al contador. El impacto de la deuda existente crece, no aparece. El parche manual mientras eso no se resuelva es volver a correr el backfill: re-crear el script desde el bloque de código de este spec, correrlo y borrarlo.
- **Usuario que paga y no se inscribe por cupo agotado.** Si el cupo se agota entre el checkout y el `processed` de MercadoPago, el guard hace fallar `saveEnrollment` y la inscripción no se crea, pero el pago ya está cobrado. `FulfillPayment` corre fire-and-forget desde el webhook, así que el error solo queda en el log. La validación de `CreateOrder` reduce la ventana a la duración del pago. Mitigación completa fuera de este spec: cola de reintentos o reembolso automático.
- **El backfill corre contra la base de producción.** Es un `bulkWrite` que sobreescribe `current_enrolled` de todos los cursos con la cuenta real de `enrollments`. Si hay inscripciones borradas a mano o enrollments huérfanas, el contador queda reflejando la colección, que es justamente lo que se quiere. Es idempotente y no borra nada más que el campo `spots_remaining` abortado. Conviene correrlo con la app detenida o en una ventana de poco tráfico: una inscripción concurrente al `bulkWrite` puede perder su `$inc`.
- **Conflicto con los cambios sin commitear del working copy.** `src/data/mongo/models/course.model.ts` tiene el `spots_remaining` que el paso 1 revierte, y `src/domain/dtos/course/course-filter.dto.ts` está modificado por otro tema. Si el schema ya se commiteó con el campo, el paso 1 pasa a ser un cambio commiteado más el `$unset` del backfill.


