import { Router } from "express";
import { DependencyContainer } from "../dependency-container";

export class PaymentRouter {
    
    static get routes() {

        const router = Router();

        const { paymentController , authMiddleware , paymentMiddleware } = DependencyContainer.getInstance();
        
        router.post(
            '/',
            [ authMiddleware.validateJWT ],
            paymentController.startPayment,
        );

        router.post(
            '/notifications',
            [ paymentMiddleware.validateMercadoPagoNotification ],
            paymentController.webhookHandler
        )

        router.get(
            '/methods',
            paymentController.findPaymentsMethods,
        );

        router.get(
            '/identification-types',
            paymentController.findIdentificationTypes
        );

        router.post(
            '/total',
            paymentController.calculateTotal
        );

        return router;
    }

};