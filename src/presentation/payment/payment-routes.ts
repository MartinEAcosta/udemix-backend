import { Router } from "express";
import { DependencyContainer } from "../dependency-container";

export class PaymentRouter {
    
    static get routes() {

        const router = Router();

        const { paymentController } = DependencyContainer.getInstance();
        
        router.get(
            '/methods',
            paymentController.findPaymentsMethods,
        );


        return router;
    }

};