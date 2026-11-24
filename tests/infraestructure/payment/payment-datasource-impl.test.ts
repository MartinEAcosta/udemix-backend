import { describe, expect, test } from '@jest/globals';
import { PaymentDataSourceImpl } from '../../../src/infraestructure/datasources/payment-datasource-impl';
import { PaymentUpdateDto } from '../../../src/domain/dtos/payment/payment-update.dto';
import { CustomError } from '../../../src/domain/errors/custom-error';
import { PaymentService } from '../../../src/domain/services/PaymentService';

// Estos casos fallan antes de tocar Mongo, así que no necesitan conexión.
describe('PaymentDataSourceImpl flavour checks' , () => {

    const datasource = new PaymentDataSourceImpl( {} as PaymentService );

    test('updatePayment rejects a statusFromGateway DTO as a programming error, not a 404' , async() => {
        const dto = PaymentUpdateDto.statusFromGateway({ id_payment : 'mp-id' , status : 'processed' });

        const error = await datasource.updatePayment( dto ).catch( e => e );

        expect( error ).toBeInstanceOf( Error );
        // No es CustomError: HandlerResponses lo loguea y responde un 500 genérico sin filtrar el mensaje.
        expect( error ).not.toBeInstanceOf( CustomError );
    });
});
