import { Router } from "express";
import { DependencyContainer } from "../dependency-container";

export class OrderRouter {

    static get routes() {

        const router = Router();

        const { orderController , authMiddleware , paymentMiddleware } = DependencyContainer.getInstance();

        router.post(
            '/notifications',
            [ paymentMiddleware.validateMercadoPagoNotification ],
            orderController.webhookHandler
        );

        router.post(
            '/',
            [ authMiddleware.validateJWT ],
            orderController.createOrder,
        );

        router.get(
            '/:id',
            [ authMiddleware.validateJWT ],
            orderController.findOrderById,
        );

        return router;
    }

};
