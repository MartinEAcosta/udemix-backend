import { Router } from "express";
import { DependencyContainer } from "../dependency-container";

export class PaymentRouter {
    
    static get routes() {

        const router = Router();

        const { paymentController , authMiddleware} = DependencyContainer.getInstance();
        
        router.post(
            '/',
            [ authMiddleware.validateJWT ],
            paymentController.createPayment,
        );

        router.get(
            '/methods',
            paymentController.findPaymentsMethods,
        );

        router.get(
            '/identificationTypes',
            paymentController.findIdentificationTypes
        );


        return router;
    }

};