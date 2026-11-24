import { PaymentModel } from '../../data/mongo/models/payment.model';
import { PaymentDataSource } from '../../domain/datasources/payment-datasource';
import { PaymentRequestDTO } from '../../domain/dtos/payment/payment-request.dto';
import { PaymentUpdateDto } from '../../domain/dtos/payment/payment-update.dto';
import { IdentificationTypesResponse, PaymentMethodsResponse, PaymentResponseDto } from '../../domain/dtos/payment/payment.response';
import { PaymentService } from '../../domain/services';
import { PaymentMapper } from '../mappers/payment.mapper';
import { CustomError } from '../../domain/errors/custom-error';

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
        if( !( paymentRequest instanceof PaymentUpdateDto ) ) {
            throw CustomError.internalServer('updatePayment exige un PaymentUpdateDto construido por sus factories.');
        }

        const { id , ...fieldsToUpdate } = paymentRequest;

        // El id va directo: findByIdAndUpdate ya envuelve en { _id : ... }, y pasarle el objeto
        // armaba { _id : { _id : id } }, que sólo funcionaba por el fallback del cast de ObjectId.
        const paymentToUpdate = await PaymentModel.findByIdAndUpdate( id , { $set : fieldsToUpdate } , { new : true }).exec();
        if( !paymentToUpdate ) throw CustomError.notFound('El pago que intentas actualizar no existe.');

        return PaymentMapper.fromPaymentResponseDto( paymentToUpdate );
    }

    async updatePaymentByIdPayment( paymentRequest : PaymentUpdateDto ) : Promise<PaymentResponseDto> {
        if( !( paymentRequest instanceof PaymentUpdateDto ) ) {
            throw CustomError.internalServer('updatePaymentByIdPayment exige un PaymentUpdateDto construido por sus factories.');
        }

        const { id , ...fieldsToUpdate } = paymentRequest;

        const paymentToUpdate = await PaymentModel.findOneAndUpdate({ id_payment : paymentRequest.id_payment }, { $set : fieldsToUpdate } , { new : true }).exec();
        if( !paymentToUpdate ) throw CustomError.notFound('El pago que intentas actualizar no existe.');

        return PaymentMapper.fromPaymentResponseDto( paymentToUpdate );
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