import { envs } from "../config";
import { AuthRepositoryImpl } from "../infraestructure/repositories/auth-repository-impl";
import { AuthController } from "./auth/auth-controller";
import { CategoryController } from "./category/category-controller";
import { CourseController } from "./course/course-controller";
import { EnrollmentController } from "./enrollment/enrollment-controller";
import { FileUploadController } from "./file/file-upload-controller";
import { LessonController } from "./lesson/lesson-controller";
import { ModuleController } from "./module/module.controller";
import { AuthMiddleware, CourseMiddleware, PaginationMiddleware , FileMiddleware } from "./middlewares";
import { AuthRepository } from "../domain/repository/auth-repository";
import { CategoryRepository } from "../domain/repository/category-repository";
import { CourseRepository } from "../domain/repository/course-repository";
import { EnrollmentRepository } from "../domain/repository/enrollment-repository";
import { FileUploadRepository } from "../domain/repository/file-upload-repository";
import { LessonRepository } from '../domain/repository/lesson-repository';
import { ModuleRepository } from '../domain/repository/module-repository';
import { EmailValidator , Encrypter , FileStorage , TokenManager , UnitOfWork } from "../domain/services";
import { MongooseUnitOfWork } from "../data/mongoose-unit-of-work";
import { BcryptAdapter , CloudinaryAdapter , EmailSenderAdapter , JwtAdapter } from "../config/adapters";
import { CategoryRepositoryImpl } from "../infraestructure/repositories/category-repository-impl";
import { CourseRepositoryImpl } from "../infraestructure/repositories/course-repository-impl";
import { EnrollmentDatasourceImpl } from "../infraestructure/datasources/enrollment-datasource-impl";
import { FileUploadRepositoryImpl } from "../infraestructure/repositories/file-upload-repository-impl";
import { LessonRepositoryImpl } from "../infraestructure/repositories/lesson-repository-impl";
import { ModuleRepositoryImpl } from "../infraestructure/repositories/module-repository-impl";
import { ModuleDatasourceImpl } from "../infraestructure/datasources/module-datasource-impl";
import { LessonDatasourceImpl } from "../infraestructure/datasources/lesson-datasource-impl";
import { FileUploadDatasourceImpl } from '../infraestructure/datasources/file-upload-datasource-impl';
import { EnrollmentRepositoryImpl } from "../infraestructure/repositories/enrollment-repository-impl";
import { AuthDatasourceImpl } from "../infraestructure/datasources/auth-datasource-impl";
import { CategoryDataSourceImpl } from "../infraestructure/datasources/category-datasource-impl";
import { CourseDatasourceImpl } from "../infraestructure/datasources/course-datasource-impl";
import { EmailController } from "./auth/email-controller";


export class DependencyContainer {

    private static instance : DependencyContainer | null = null; 


    //* Middlewares
    readonly authMiddleware : AuthMiddleware;
    readonly courseMiddleware : CourseMiddleware;
    readonly fileMiddleware   : FileMiddleware;
    readonly paginationMiddleware : PaginationMiddleware;

    //* Controladores
    readonly authController       : AuthController;
    readonly categoryController   : CategoryController;
    readonly courseController     : CourseController;
    readonly emailController      : EmailController;
    readonly enrollmentController : EnrollmentController;
    readonly fileController       : FileUploadController;
    readonly lessonController     : LessonController;
    readonly moduleController     : ModuleController;

    //* Repositorios
    readonly authRepository       : AuthRepository;
    readonly categoryRepository   : CategoryRepository;
    readonly courseRepository     : CourseRepository;
    readonly enrollmentRepository : EnrollmentRepository;
    readonly fileRepository       : FileUploadRepository;
    readonly lessonRepository     : LessonRepository;
    readonly moduleRepository     : ModuleRepository;

    //* Services 
    readonly emailValidator : EmailValidator;
    readonly encrypter    : Encrypter;
    readonly fileStorage : FileStorage;
    readonly tokenManager : TokenManager;
    readonly unitOfWork : UnitOfWork;
    

    private constructor( ) {
        this.emailValidator = new EmailSenderAdapter(
                                                        envs.MAILER_SERVICE,
                                                        envs.MAILER_EMAIL,
                                                        envs.MAILER_SECRET_KEY,
                                                        envs.WEBSERVICE_URL,
        );
        this.encrypter = new BcryptAdapter();
        this.fileStorage = new CloudinaryAdapter();
        this.tokenManager = new JwtAdapter();
        this.unitOfWork = new MongooseUnitOfWork();

        this.authRepository       = new AuthRepositoryImpl( new AuthDatasourceImpl() );
        this.categoryRepository   = new CategoryRepositoryImpl( new CategoryDataSourceImpl() );
        this.courseRepository     = new CourseRepositoryImpl( new CourseDatasourceImpl() );
        this.enrollmentRepository = new EnrollmentRepositoryImpl( new EnrollmentDatasourceImpl() );
        this.fileRepository       = new FileUploadRepositoryImpl( new FileUploadDatasourceImpl( this.fileStorage ) );
        this.lessonRepository     = new LessonRepositoryImpl( new LessonDatasourceImpl() );
        this.moduleRepository     = new ModuleRepositoryImpl( new ModuleDatasourceImpl() );
        
        this.authMiddleware = new AuthMiddleware( this.tokenManager , this.authRepository);
        this.courseMiddleware = new CourseMiddleware( );
        this.fileMiddleware   = new FileMiddleware();
        this.paginationMiddleware = new PaginationMiddleware();
        

        this.authController       = new AuthController( this.authRepository, this.encrypter , this.tokenManager );
        this.categoryController   = new CategoryController( this.categoryRepository );
        this.courseController     = new CourseController( this.courseRepository , this.categoryRepository , this.fileRepository );
        this.emailController      = new EmailController( this.authRepository , this.emailValidator , this.tokenManager );
        this.enrollmentController = new EnrollmentController( this.enrollmentRepository , this.authRepository , this.courseRepository , this.unitOfWork );
        this.fileController       = new FileUploadController( this.fileRepository , this.courseRepository );
        this.lessonController     = new LessonController( this.lessonRepository , this.moduleRepository , this.courseRepository , this.fileRepository, this.unitOfWork );
        this.moduleController     = new ModuleController( this.moduleRepository , this.courseRepository );
    }

    public static getInstance() : DependencyContainer {
        if (!this.instance) {
            this.instance = new DependencyContainer();
        }
        return this.instance;
    }
}