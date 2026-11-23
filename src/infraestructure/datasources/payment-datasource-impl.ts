import { PaymentModel } from '../../data/mongo/models/payment.model';
import { PaymentDataSource } from '../../domain/datasources/payment-datasource';
import { PaymentRequestDTO } from '../../domain/dtos/payment/payment-request.dto';
import { PaymentUpdateDto } from '../../domain/dtos/payment/payment-update.dto';
import { IdentificationTypesResponse, PaymentMethodsResponse, PaymentResponseDto } from '../../domain/dtos/payment/payment.response';
import { PaymentService } from '../../domain/services';
import { PaymentMapper } from '../mappers/payment.mapper';
import { pickFields } from '../helpers/pick-fields';

export class PaymentDataSourceImpl implements PaymentDataSource {

    /**
     * Claves que un update de pago puede escribir. `id` queda afuera porque es el filtro,
     * no un campo: pasaba al update doc y sobrevivía sólo porque el strict de Mongoose
     * descarta las claves que no están en el schema.
     */
    private static readonly UPDATABLE_PAYMENT_FIELDS = [ 'status' , 'date' , 'method' , 'id_payment' ] as const;

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
        const fieldsToUpdate = pickFields( paymentRequest , PaymentDataSourceImpl.UPDATABLE_PAYMENT_FIELDS );

        // El id va directo: findByIdAndUpdate ya envuelve en { _id : ... }, y pasarle el objeto
        // armaba { _id : { _id : id } }, que sólo funcionaba por el fallback del cast de ObjectId.
        const paymentToUpdate = await PaymentModel.findByIdAndUpdate( paymentRequest.id , { $set : fieldsToUpdate } , { new : true }).exec();

        return PaymentMapper.fromPaymentResponseDto( paymentToUpdate! );
    }

    async updatePaymentByIdPayment( paymentRequest : PaymentUpdateDto ) : Promise<PaymentResponseDto> {
        const fieldsToUpdate = pickFields( paymentRequest , PaymentDataSourceImpl.UPDATABLE_PAYMENT_FIELDS );

        const paymentToUpdate = await PaymentModel.findOneAndUpdate({ id_payment : paymentRequest.id_payment }, { $set : fieldsToUpdate } , { new : true }).exec();

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