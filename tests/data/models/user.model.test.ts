import { beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import { Types } from 'mongoose';
import { MongoDatabase } from '../../../src/data/init';
import { envs } from '../../../src/config/envs';
import { UserModel } from '../../../src/data/mongo/models/user.model';

describe('User Model' , () => {

    beforeAll(async() => {
        await MongoDatabase.connect({
            dbUrl : envs.DB_CON,
            dbName : envs.DB_NAME,
        });
    });

    test('should create a user' , async() => {
        const user = {
            username : 'John Doe',
            email : 'johndoe@gmail.com',
            password : 'smartpassword',
        };

        const createdUser = await UserModel.create(user);

        expect(createdUser.toObject()).toMatchObject({
            ...user,
            _id: expect.any(Types.ObjectId),
            role: expect.any(String),
            isEmailVerified: expect.any(Boolean),
            balance: expect.any(Number),
        });

        await UserModel.findByIdAndDelete(createdUser._id);
    });

    test('should return the schema object' , () => {

        const schema = UserModel.schema.obj;

        expect(schema).toEqual( expect.objectContaining(
            {
                username : { type : String, required : [ true , "El nombre de usuario es requerido."] },
                email : { type : String, required : [ true , 'El email es requerido.'], unique : true },
                isEmailVerified : { type : Boolean, default : false },
                role : { type : String,
                        enum : ['student' , 'teacher' , 'admin' ],
                        default : 'student'
                    },
                password : { type : String, required : [true , 'La contraseña es requerida.'] },
                balance : { type : Number, default : 0},
            }
        ));
        
    });
});