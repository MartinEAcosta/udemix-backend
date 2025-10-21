import { envs } from "../config";
import { AuthController } from "./auth/auth-controller";
import { CategoryController } from "./category/category-controller";
import { CourseController } from "./course/course-controller";
import { EmailController } from "./auth/email-controller";
import { EnrollmentController } from "./enrollment/enrollment-controller";
import { FileController } from "./file/file-controller";
import { LessonController } from "./lesson/lesson-controller";
import { ModuleController } from "./module/module.controller";
import { AuthMiddleware, CourseMiddleware, PaginationMiddleware , FileMiddleware } from "./middlewares";
import { EmailValidator , Encrypter , FileStorage , PaymentService, TokenManager , UnitOfWork } from "../domain/services";
import { MongooseUnitOfWork } from "../data/mongoose-unit-of-work";
import { BcryptAdapter , CloudinaryAdapter , EmailSenderAdapter , JwtAdapter } from "../config/adapters";
import { AuthRepository, CategoryRepository, CourseRepository, EnrollmentRepository, FileRepository , LessonRepository, ModuleRepository } from "../domain/repository";
import { AuthRepositoryImpl, CategoryRepositoryImpl, CourseRepositoryImpl, EnrollmentRepositoryImpl, FileRepositoryImpl, LessonRepositoryImpl, ModuleRepositoryImpl } from "../infraestructure/repositories";
import { AuthDatasourceImpl, CategoryDataSourceImpl, CourseDatasourceImpl, EnrollmentDatasourceImpl, FileDatasourceImpl, LessonDatasourceImpl, ModuleDatasourceImpl } from "../infraestructure/datasources";
import { PaymentRepository } from "../domain/repository/payment-repository";
import { PaymentController } from "./payment/payment-controller";
import { MercadoPagoAdapter } from "../config/adapters/mercadopago-adapter";
import { Payment } from "mercadopago";
import { PaymentRepositoryImpl } from '../infraestructure/repositories/payment-repository-impl';
import { PaymentDataSource } from "../domain/datasources/payment-datasource";
import { PaymentDataSourceImpl } from "../infraestructure/datasources/payment-datasource-impl";


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
    readonly fileController       : FileController;
    readonly lessonController     : LessonController;
    readonly moduleController     : ModuleController;
    readonly paymentController    : PaymentController;

    //* Repositorios
    readonly authRepository       : AuthRepository;
    readonly categoryRepository   : CategoryRepository;
    readonly courseRepository     : CourseRepository;
    readonly enrollmentRepository : EnrollmentRepository;
    readonly fileRepository       : FileRepository;
    readonly lessonRepository     : LessonRepository;
    readonly moduleRepository     : ModuleRepository;
    readonly paymentRepository    : PaymentRepository

    //* Services 
    readonly emailValidator : EmailValidator;
    readonly encrypter    : Encrypter;
    readonly fileStorage : FileStorage;
    readonly tokenManager : TokenManager;
    readonly unitOfWork : UnitOfWork;
    readonly paymentService : PaymentService;
    

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
        this.paymentService = new MercadoPagoAdapter(
                                                        envs.MERCADOPAGO_ACCESS_TOKEN
        );

        this.authRepository       = new AuthRepositoryImpl( new AuthDatasourceImpl() );
        this.categoryRepository   = new CategoryRepositoryImpl( new CategoryDataSourceImpl() );
        this.courseRepository     = new CourseRepositoryImpl( new CourseDatasourceImpl() );
        this.enrollmentRepository = new EnrollmentRepositoryImpl( new EnrollmentDatasourceImpl() );
        this.fileRepository       = new FileRepositoryImpl( new FileDatasourceImpl( this.fileStorage ) );
        this.lessonRepository     = new LessonRepositoryImpl( new LessonDatasourceImpl() );
        this.moduleRepository     = new ModuleRepositoryImpl( new ModuleDatasourceImpl() );
        this.paymentRepository    = new PaymentRepositoryImpl( new PaymentDataSourceImpl( this.paymentService ) );
        
        this.authMiddleware = new AuthMiddleware( this.tokenManager , this.authRepository);
        this.courseMiddleware = new CourseMiddleware( );
        this.fileMiddleware   = new FileMiddleware();
        this.paginationMiddleware = new PaginationMiddleware();
        

        this.authController       = new AuthController( this.authRepository, this.encrypter , this.tokenManager );
        this.categoryController   = new CategoryController( this.categoryRepository );
        this.courseController     = new CourseController( this.courseRepository , this.categoryRepository , this.fileRepository );
        this.emailController      = new EmailController( this.authRepository , this.emailValidator , this.tokenManager );
        this.enrollmentController = new EnrollmentController( this.enrollmentRepository , this.authRepository , this.courseRepository , this.unitOfWork );
        this.fileController       = new FileController( this.fileRepository , this.courseRepository );
        this.lessonController     = new LessonController( this.lessonRepository , this.moduleRepository , this.courseRepository , this.fileRepository, this.unitOfWork );
        this.moduleController     = new ModuleController( this.moduleRepository , this.courseRepository );
        this.paymentController    = new PaymentController( this.paymentRepository , this.courseRepository, this.authRepository );
    }

    public static getInstance() : DependencyContainer {
        if (!this.instance) {
            this.instance = new DependencyContainer();
        }
        return this.instance;
    }
}