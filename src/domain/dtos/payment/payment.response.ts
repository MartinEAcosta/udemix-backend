export interface ItemQuantity {
    id_course : string,
    quantity : number,
}

export interface PaymentMethodsResponse {
    id: string,
    name: string,
    payment_type_id: string,
    status: string,
    secure_thumbnail: string,
    thumbnail: string,
    deferred_capture: string,
    settings: {
        card_number: {
            length: number,
            validation: string,
        },
        security_code: {
            mode: string,
            length: number,
            card_location: string,
        }
    },
    additional_info_needed: [
    {}
    ],
    min_allowed_amount: number,
    max_allowed_amount: number,
    accreditation_time: number,
    financial_institutions: {},
    processing_modes: string,
}

export interface PaymentRequestAdapter{
    token: string,
    installments: number,
    transaction_amount: number,
    description: string,
    payment_method_id: string,
    payer: {
        email: string,
    }
};

export interface IdentificationTypesResponse{
    id: string;
    name: string;
    type: string;
    min_length?: number;
    max_length?: number;
}