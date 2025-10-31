import { NextFunction, Request, Response } from "express";
import crypto from 'crypto';
import { HandlerResponses } from "../helpers/handler-responses";
import { CustomError } from "../../domain/errors/custom-error";
import { envs } from "../../config";

export class PaymentMiddleware {
    
    validateMercadoPagoNotification = ( req : Request , res : Response , next : NextFunction ) => {
        const key = req.header('x-signature');
        const request_id = req.header('x-request-id');
        if( !key ) {
            HandlerResponses.handleError( CustomError.unauthorized('La petición fue rechazada debido a que no cuenta con la llave de acceso.' ) , res );
        }
        
        const [ tsParsed , v1Parsed ] = key!.split(',');
        if( !tsParsed || !v1Parsed ) return HandlerResponses.handleError( CustomError.internalServer('Hubo un error al interar parsear los headers.') , res);
        const ts = tsParsed.split("=")[1];
        const v1 = v1Parsed.split("=")[1];
        const { data } = req.body;
        const signatureTemplateParsed = `id:${data.id};request-id:${request_id};ts:${ts};`;
        console.log(req.body);
        console.log(signatureTemplateParsed);

        const cyphedSignature = crypto
            .createHmac('sha256', envs.MERCADOPAGO_WEBHOOK_SECRET_KEY)
            .update(signatureTemplateParsed)
            .digest('hex');


        if( cyphedSignature === v1 ){
            next();
        }
        else{
            return HandlerResponses.handleError(CustomError.unauthorized('Las credenciales no coinciden.'), res);
        }
    }


}