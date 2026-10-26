import { PaymentModel } from '../../data/mongo/models/payment.model';
import { PaymentDataSource } from '../../domain/datasources/payment-datasource';
import { PaymentRequestDTO } from '../../domain/dtos/payment/payment-request.dto';
import { PaymentUpdateDto } from '../../domain/dtos/payment/payment-update.dto';
import { IdentificationTypesResponse, PaymentMethodsResponse, PaymentResponseDto } from '../../domain/dtos/payment/payment.response';
import { PaymentService } from '../../domain/services';
import { PaymentMapper } from '../mappers/payment.mapper';

export class PaymentDataSourceImpl implements PaymentDataSource {

    constructor(
        private readonly paymentService : PaymentService
    ) { }

    async createPayment( paymentRequest : PaymentRequestDTO ) : Promise<PaymentResponseDto> {
        const paymentToSave = await PaymentModel.create({ 
            ...paymentRequest
        });

        return PaymentMapper.fromPaymentResponseDto( paymentToSave );
    }
    
    async updatePayment( paymentRequest : PaymentUpdateDto ) : Promise<PaymentResponseDto> {
        const paymentToUpdate = await PaymentModel.findByIdAndUpdate({ _id : paymentRequest.id }, paymentRequest , { new : true }).exec();
        
        return PaymentMapper.fromPaymentResponseDto( paymentToUpdate! );
    }

    async updatePaymentByIdPayment( paymentRequest : PaymentUpdateDto ) : Promise<PaymentResponseDto> {
        const paymentToUpdate = await PaymentModel.findOneAndUpdate({ id_payment : paymentRequest.id_payment }, paymentRequest , { new : true }).exec();
        
        return PaymentMapper.fromPaymentResponseDto( paymentToUpdate! );
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