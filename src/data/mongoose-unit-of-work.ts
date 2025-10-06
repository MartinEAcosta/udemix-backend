// import mongoose from "mongoose";
// import { AuthRepository } from "../domain/repository/auth-repository";
// import { CourseRepositoryImpl } from "../infraestructure/repositories/course-repository-impl";
// import { LessonRepositoryImpl } from "../infraestructure/repositories/lesson-repository-impl";
// import { AuthRepositoryImpl } from "../infraestructure/repositories/auth-repository-impl";
// import { CategoryRepositoryImpl } from "../infraestructure/repositories/category-repository-impl";
// import { EnrollmentRepositoryImpl } from "../infraestructure/repositories/enrollment-repository-impl";
// import { FileUploadRepositoryImpl } from "../infraestructure/repositories/file-upload-repository-impl";


// export class MongooseUnitOfWork{

//     // El callback work consiste en la función o trabajo que se realiza que puede
//     // llegar a fallar.
//     async withTransaction( work : (repos : any) => Promise<any> ) {
//         const session = await mongoose.startSession();
//         try{

//             session.startTransaction();



//             const repositories = {
//                 userRepository : new AuthRepositoryImpl( session ),
//                 courseRepository : new CourseRepositoryImpl( session ),
//                 categoryRepository : new CategoryRepositoryImpl( session ),
//                 enrollmentRepository : new EnrollmentRepositoryImpl( session ),
//                 fileRepository : new FileUploadRepositoryImpl( session ),
//                 lessonRepository : new LessonRepositoryImpl( session ),
//             };

//             const result = await work( repositories );
//             await session.commitTransaction();

//             return result;
//         }
//         catch( error ){
//             await session.abortTransaction();
//             throw error;
//         }
//         finally{
//             session.endSession();
//         }
//     } 

// }