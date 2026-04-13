import { Router } from "express";

import { DeliveriesLogsController } from "@/controllers/deliveries-logs-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";

const deliveriesLogsRoutes = Router();
const deliveriesLogsController = new DeliveriesLogsController();

deliveriesLogsRoutes.post(
    "/", 
    ensureAuthenticated, 
    verifyUserAuthorization(["Sale"]),
    deliveriesLogsController.create
);

deliveriesLogsRoutes.get(
    "/:deliveryId/show",
    ensureAuthenticated,
    verifyUserAuthorization(["Sale", "Customer"]),
    deliveriesLogsController.show
);

export { deliveriesLogsRoutes };