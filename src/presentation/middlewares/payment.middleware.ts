import { NextFunction, Request, Response } from "express";
import crypto from 'crypto';
import { HandlerResponses } from "../helpers/handler-responses";
import { CustomError } from "../../domain/errors/custom-error";
import { envs } from "../../config";

export class PaymentMiddleware {
    
    validateMercadoPagoNotification = ( req : Request , res : Response , next : NextFunction ) => {
        const signatureHeader = req.header("x-signature");
        const requestId = req.header("x-request-id");

        if (!signatureHeader) {
        return HandlerResponses.handleError(CustomError.unauthorized("Falta x-signature."), res);
        }

        // Parseo por clave: "ts=123,v1=abc" (tolera espacios y orden)
        const parts = Object.fromEntries(
        signatureHeader.split(",").map(p => {
            const [k, ...v] = p.trim().split("=");
            return [k, v.join("=")];
        })
        );
        const ts = parts["ts"];
        const v1 = parts["v1"];

        if (!ts || !v1) {
        return HandlerResponses.handleError(CustomError.unauthorized("x-signature mal formado."), res);
        }

        // id desde el query (?data.id=...), fallback al body; en minúsculas si es alfanumérico
        const rawId = (req.query["data.id"] as string | undefined) ?? req.body?.data?.id;
        const dataId = rawId ? String(rawId).toLowerCase() : undefined;

        // El manifest omite las partes que no vienen
        let manifest = "";
        if (dataId)    manifest += `id:${dataId};`;
        if (requestId) manifest += `request-id:${requestId};`;
        manifest += `ts:${ts};`;

        const expected = crypto
            .createHmac("sha256", envs.MERCADOPAGO_WEBHOOK_SECRET_KEY.trim())
            .update(manifest)
            .digest("hex");

        const valid =
        expected.length === v1.length &&
        crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(v1));

        if (!valid) {
         console.warn("Firma inválida", { manifest }); // útil para debuggear
          return HandlerResponses.handleError(CustomError.unauthorized("Firma inválida."), res);
        }

        next();
    }

}