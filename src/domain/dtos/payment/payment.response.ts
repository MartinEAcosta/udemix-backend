
export interface WebhookPayload{
  action: string,
  api_version: string
  data: { 
    id: number
   },
  date_created: string,
  id: number,
  live_mode: boolean,
  type: string,
  user_id: number,
}

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


export interface IdentificationTypesResponse{
    id: string;
    name: string;
    type: string;
    min_length?: number;
    max_length?: number;
}

export interface PaymentResponse {
    id : number,
    date_created : string,
    date_approved : string,
    date_last_updated : string,
    transaction_amount : number,
    payer: {
        email : string,
    },
    cardholder : {
        name : string,
        identification : {
            number :  number,
            type   : string
        }
    },
    status : string,
    status_detail : string,
}