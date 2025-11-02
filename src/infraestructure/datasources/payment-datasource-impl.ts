import { PaymentModel } from '../../data/mongo/models/payment.model';
import { PaymentDataSource } from '../../domain/datasources/payment-datasource';
import { PaymentCreateDto } from '../../domain/dtos/payment/payment-create.dto';
import { IdentificationTypesResponse, PaymentMethodsResponse } from '../../domain/dtos/payment/payment.response';
import { UserEntity } from '../../domain/entities/user.entity';
import { PaymentService } from '../../domain/services';
import { PaymentMapper } from '../mappers/payment.mapper';


export class PaymentDataSourceImpl implements PaymentDataSource {

    constructor( 
        private readonly paymentService : PaymentService
    ) { }
    
    async createPayment( paymentRequestDto : PaymentCreateDto , user : UserEntity ) : Promise<any> {
        const paymentResponse = await this.paymentService.createPayment( paymentRequestDto );
        if( !paymentResponse ) return null;

        const paymentToSave = await PaymentModel.create({ 
                                                            id_courses : paymentRequestDto.items.map( item => item.id_course ),
                                                            id_user    : user.id,
                                                            id_payment : paymentResponse.id,
                                                            amount     : paymentResponse.transaction_amount,
                                                            method     : 'card',
                                                            status     : paymentResponse.status,
                                                        });
        console.log( paymentToSave );
        return PaymentMapper.MapResponseToEntity( paymentToSave );
    }
    
    async findPaymentsMethods() : Promise<PaymentMethodsResponse[]> {
        const paymentsMethods = await this.paymentService.findPaymentsMethods();
        return paymentsMethods;
    }
    
    async findIdentificationTypes() : Promise<IdentificationTypesResponse[]> {
        const identificationTypes = await this.paymentService.findIdentificationTypes();
        return identificationTypes;
    }

}