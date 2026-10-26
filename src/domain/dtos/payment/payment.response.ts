
export interface PaymentResponseDto{
    id ?: string,
    id_user : string,
    id_courses : string[],
    id_payment : string | null,
    amount : number,
    date : Date,
    method : string | null,
    status : string,
}

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

export interface PaymentMethodSettingsCardNumber {
    length: number,
    validation: string,
}

export interface PaymentMethodSettingsSecurityCode {
    mode: string,
    length: number,
    card_location: string,
}

export interface PaymentMethodSettings {
    card_number ?: PaymentMethodSettingsCardNumber,
    security_code ?: PaymentMethodSettingsSecurityCode,
}

export interface PaymentMethodFinancialInstitution {
    id ?: number,
    description ?: string,
}

export interface PaymentMethodsResponse {
    id: string,
    name: string,
    payment_type_id: string,
    status: string,
    secure_thumbnail: string,
    thumbnail: string,
    deferred_capture: string,
    settings: PaymentMethodSettings[],
    additional_info_needed: string[],
    min_allowed_amount: number,
    max_allowed_amount: number,
    accreditation_time: number,
    financial_institutions: PaymentMethodFinancialInstitution[],
    processing_modes: string[],
}


export interface IdentificationTypesResponse{
    id: string;
    name: string;
    type: string;
    min_length?: number;
    max_length?: number;
}

export interface OrderGatewayResult {
    id : string,
    status : string,
}