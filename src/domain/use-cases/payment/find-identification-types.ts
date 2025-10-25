import { IdentificationTypesResponse } from "../../dtos/payment/payment.response";
import { PaymentRepository } from "../../repository/payment-repository";

interface FindIdentificationTypesUseCase {
    execute ( ) : Promise<IdentificationTypesResponse[]>;
}

export class FindIdentificationTypes implements FindIdentificationTypesUseCase {

    constructor(
        private readonly paymentRepository : PaymentRepository,
    ) {}

    async execute() : Promise<IdentificationTypesResponse[]> {

        const identificationTypes = await this.paymentRepository.findIdentificationTypes();

        return identificationTypes;
    }

}