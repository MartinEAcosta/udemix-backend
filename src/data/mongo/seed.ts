import { envs } from "../../config/envs";
import { BcryptAdapter } from "../../config/adapters";
import { MongoDatabase } from "../init";
import { CategoryModel } from "./models/category.model";
import { UserModel } from "./models/user.model";
import { CourseModel } from "./models/course.model";
import { ModuleModel } from "./models/module.model";
import { LessonModel } from "./models/lesson.model";
import { EnrollmentModel } from "./models/enrollment.model";
import { PaymentModel } from "./models/payment.model";
import { FileModel } from "./models/file.model";

// Contraseña fija para todos los usuarios seed: Password123!
const SEED_PASSWORD = 'Password123!';

const bcryptAdapter = new BcryptAdapter();

const assertNotProduction = () => {
    if ( process.env.NODE_ENV === 'production' ) {
        console.error( 'El seed no puede correr con NODE_ENV=production.' );
        process.exit( 1 );
    }
}

const cleanCollections = async () => {
    await Promise.all([
        CategoryModel.deleteMany({}),
        UserModel.deleteMany({}),
        CourseModel.deleteMany({}),
        ModuleModel.deleteMany({}),
        LessonModel.deleteMany({}),
        EnrollmentModel.deleteMany({}),
        PaymentModel.deleteMany({}),
        FileModel.deleteMany({}),
    ]);
}

const seedCategories = async () => {
    const categories = await CategoryModel.insertMany([
        { name: 'Programación', slug: 'programacion' },
        { name: 'Diseño', slug: 'diseno' },
        { name: 'Negocios', slug: 'negocios' },
    ]);

    return categories;
}

const USERS_SEED = [
    { username: 'Admin Udemix', email: 'admin@udemix.test', role: 'admin', balance: 0 },
    { username: 'Teacher Ana', email: 'teacher.ana@udemix.test', role: 'teacher', balance: 0 },
    { username: 'Teacher Bruno', email: 'teacher.bruno@udemix.test', role: 'teacher', balance: 0 },
    { username: 'Student Carla', email: 'student.carla@udemix.test', role: 'student', balance: 5000 },
    { username: 'Student Diego', email: 'student.diego@udemix.test', role: 'student', balance: 0 },
    { username: 'Student Elena', email: 'student.elena@udemix.test', role: 'student', balance: 10000 },
];

const seedUsers = async () => {
    const avatarFiles = await FileModel.insertMany(
        USERS_SEED.map( ( _ , index ) => ({
            public_id: `seed/user/avatar-${ index + 1 }`,
            url: `https://picsum.photos/seed/avatar-${ index + 1 }/200`,
            folder: 'user',
            size: 10240,
            extension: 'jpg',
            resource_type: 'image',
        }) )
    );

    const hashedPassword = bcryptAdapter.hash( SEED_PASSWORD );

    const users = await UserModel.insertMany(
        USERS_SEED.map( ( user , index ) => ({
            username: user.username,
            email: user.email,
            isEmailVerified: true,
            role: user.role,
            password: hashedPassword,
            balance: user.balance,
            avatar_url: avatarFiles[ index ].url,
            id_file: avatarFiles[ index ]._id,
        }) )
    );

    return users;
}

const COURSES_SEED = [
    { title: 'JavaScript desde cero', description: 'Aprendé los fundamentos de JavaScript para desarrollo web.', categoryIndex: 0, teacherIndex: 1, price: 1500, capacity: 50 },
    { title: 'TypeScript avanzado', description: 'Tipos avanzados, genéricos y patrones en TypeScript.', categoryIndex: 0, teacherIndex: 1, price: 2000, capacity: 30 },
    { title: 'Fundamentos de Diseño UX', description: 'Principios de experiencia de usuario aplicados a producto digital.', categoryIndex: 1, teacherIndex: 2, price: 1800, capacity: 40 },
    { title: 'Introducción a Negocios Digitales', description: 'Modelos de negocio y estrategia para productos digitales.', categoryIndex: 2, teacherIndex: 2, price: 2500, capacity: 60 },
];

const seedCourses = async ( categories : Awaited<ReturnType<typeof seedCategories>> , users : Awaited<ReturnType<typeof seedUsers>> ) => {
    const thumbnailFiles = await FileModel.insertMany(
        COURSES_SEED.map( ( _ , index ) => ({
            public_id: `seed/course/thumbnail-${ index + 1 }`,
            url: `https://picsum.photos/seed/course-${ index + 1 }/600/400`,
            folder: 'course',
            size: 51200,
            extension: 'jpg',
            resource_type: 'image',
        }) )
    );

    const courses = await CourseModel.insertMany(
        COURSES_SEED.map( ( course , index ) => {
            const category = categories[ course.categoryIndex ];
            const owner = users[ course.teacherIndex ];
            const thumbnail = thumbnailFiles[ index ];

            return {
                title: course.title,
                description: course.description,
                id_category: category._id,
                category_name: category.name,
                thumbnail_url: thumbnail.url,
                id_file: thumbnail._id,
                id_owner: owner._id,
                price: course.price,
                capacity: course.capacity,
                current_enrolled: 0,
            };
        } )
    );

    return courses;
}

const MODULE_TITLES = [ 'Módulo 1: Introducción' , 'Módulo 2: Profundización' ];

const seedModules = async ( courses : Awaited<ReturnType<typeof seedCourses>> ) => {
    const modulesToInsert = courses.flatMap( ( course ) =>
        MODULE_TITLES.map( ( title , index ) => ({
            title,
            unit: index + 1,
            id_course: course._id,
        }) )
    );

    const modules = await ModuleModel.insertMany( modulesToInsert );

    return modules;
}

const LESSONS_PER_MODULE = 2;

const seedLessons = async ( courses : Awaited<ReturnType<typeof seedCourses>> , modules : Awaited<ReturnType<typeof seedModules>> ) => {
    const totalLessons = modules.length * LESSONS_PER_MODULE;

    const videoFiles = await FileModel.insertMany(
        Array.from( { length: totalLessons } , ( _ , index ) => ({
            public_id: `seed/lesson/video-${ index + 1 }`,
            url: `https://example-cdn.test/seed/lesson-video-${ index + 1 }.mp4`,
            folder: 'lesson',
            size: 10485760,
            extension: 'mp4',
            resource_type: 'video',
        }) )
    );

    const lessonsToInsert : any[] = [];
    let videoIndex = 0;

    courses.forEach( ( course , courseIndex ) => {
        const courseModules = modules.slice( courseIndex * MODULE_TITLES.length , courseIndex * MODULE_TITLES.length + MODULE_TITLES.length );
        let lessonNumber = 1;

        courseModules.forEach( ( courseModule ) => {
            for ( let i = 1 ; i <= LESSONS_PER_MODULE ; i++ ) {
                const video = videoFiles[ videoIndex++ ];

                lessonsToInsert.push({
                    id_course: course._id,
                    id_file: video._id,
                    id_module: courseModule._id,
                    title: `Lección ${ lessonNumber }: ${ courseModule.title }`,
                    description: `Contenido de la lección ${ lessonNumber } del módulo "${ courseModule.title }".`,
                    lesson_number: lessonNumber,
                });

                lessonNumber++;
            }
        });
    });

    const lessons = await LessonModel.insertMany( lessonsToInsert );

    await Promise.all(
        modules.map( ( courseModule ) => {
            const lessonIdsForModule = lessons
                .filter( ( lesson ) => lesson.id_module.equals( courseModule._id ) )
                .map( ( lesson ) => lesson._id );

            return ModuleModel.updateOne(
                { _id: courseModule._id },
                { $set: { id_lessons: lessonIdsForModule } }
            );
        })
    );

    return lessons;
}

const LESSONS_PER_COURSE = MODULE_TITLES.length * LESSONS_PER_MODULE;

const ENROLLMENTS_SEED = [
    { studentIndex: 3, courseIndex: 0, completedCount: 2 }, // Carla en JavaScript, progreso parcial
    { studentIndex: 3, courseIndex: 2, completedCount: 0 }, // Carla en UX, progreso 0
    { studentIndex: 4, courseIndex: 1, completedCount: 4 }, // Diego en TypeScript, progreso completo
    { studentIndex: 5, courseIndex: 3, completedCount: 1 }, // Elena en Negocios, progreso parcial
    { studentIndex: 5, courseIndex: 0, completedCount: 0 }, // Elena en JavaScript, progreso 0
];

const seedEnrollments = async ( courses : Awaited<ReturnType<typeof seedCourses>> , lessons : Awaited<ReturnType<typeof seedLessons>> , users : Awaited<ReturnType<typeof seedUsers>> ) => {
    const enrollmentsToInsert = ENROLLMENTS_SEED.map( ( seed ) => {
        const course = courses[ seed.courseIndex ];
        const student = users[ seed.studentIndex ];
        const courseLessons = lessons.slice( seed.courseIndex * LESSONS_PER_COURSE , seed.courseIndex * LESSONS_PER_COURSE + LESSONS_PER_COURSE );
        const completedLessons = courseLessons.slice( 0 , seed.completedCount ).map( ( lesson ) => lesson._id );

        return {
            id_user: student._id,
            id_course: course._id,
            progress: ( completedLessons.length / LESSONS_PER_COURSE ) * 100,
            completed_lessons: completedLessons,
        };
    });

    const enrollments = await EnrollmentModel.insertMany( enrollmentsToInsert );

    await Promise.all(
        courses.map( ( course ) => {
            const enrolledCount = enrollments.filter( ( enrollment ) => enrollment.id_course.equals( course._id ) ).length;

            return CourseModel.updateOne(
                { _id: course._id },
                { $set: { current_enrolled: enrolledCount } }
            );
        })
    );

    return enrollments;
}

const PAYMENTS_SEED = [
    { method: 'card', status: 'approved' },
    { method: 'balance', status: 'approved' },
    { method: 'card', status: 'approved' },
    { method: 'balance', status: 'rejected' },
    { method: 'card', status: 'in_process' },
];

const seedPayments = async ( enrollments : Awaited<ReturnType<typeof seedEnrollments>> , courses : Awaited<ReturnType<typeof seedCourses>> ) => {
    const paymentsToInsert = enrollments.map( ( enrollment , index ) => {
        const payment = PAYMENTS_SEED[ index ];
        const course = courses.find( ( c ) => c._id.equals( enrollment.id_course ) )!;

        return {
            id_user: enrollment.id_user,
            id_courses: [ course._id ],
            id_payment: `seed-payment-${ index + 1 }`,
            amount: course.price,
            method: payment.method,
            status: payment.status,
        };
    });

    const payments = await PaymentModel.insertMany( paymentsToInsert );

    return payments;
}

const main = async () => {
    assertNotProduction();

    await MongoDatabase.connect({ dbUrl: envs.DB_CON, dbName: envs.DB_NAME });

    await cleanCollections();

    const categories = await seedCategories();
    console.log( `Categorías insertadas: ${ categories.length }` );

    const users = await seedUsers();
    console.log( `Usuarios insertados: ${ users.length }` );

    const courses = await seedCourses( categories , users );
    console.log( `Cursos insertados: ${ courses.length }` );

    const modules = await seedModules( courses );
    console.log( `Módulos insertados: ${ modules.length }` );

    const lessons = await seedLessons( courses , modules );
    console.log( `Lecciones insertadas: ${ lessons.length }` );

    const enrollments = await seedEnrollments( courses , lessons , users );
    console.log( `Inscripciones insertadas: ${ enrollments.length }` );

    const payments = await seedPayments( enrollments , courses );
    console.log( `Pagos insertados: ${ payments.length }` );

    const filesCount = await FileModel.countDocuments();
    console.log( `Archivos insertados: ${ filesCount }` );

    console.log( '--- Seed completado ---' );
    console.log( `Login de prueba: cualquier email de usuario seed + contraseña "${ SEED_PASSWORD }"` );

    await MongoDatabase.connection.close();
}

main()
    .then( () => {
        console.log( 'Seed completado con éxito.' );
        process.exit( 0 );
    })
    .catch( ( error ) => {
        console.error( 'Ha surgido un error al correr el seed.' );
        console.error( error );
        process.exit( 1 );
    });
