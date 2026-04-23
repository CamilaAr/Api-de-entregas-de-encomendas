import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod";
import { AppError } from "@/utils/AppError";

class DeliveriesLogsController {
    async create(request: Request, response: Response) {

        const bodySchema = z.object({
            description: z.string().trim().min(1),
            deliveryId: z.string().trim().uuid(),
        });

        const { description, deliveryId } = bodySchema.parse(request.body);
        const delivery = await prisma.delivery.findUnique({ where: { id: deliveryId } });

        if (!delivery) {
            throw new AppError("Delivery not found", 404);
        }

        if (delivery.status === "processing") {
            throw new AppError("Delivery is not yet shipped", 400);
        }

        if (delivery.status === "delivered") {
            throw new AppError("This delivery has already been delivered", 400);
        }

        const deliveryLog = await prisma.deliveryLog.create({
            data: { 
                description, 
                deliveryId,
            },
        });

        return response.status(201).json({ message: "Delivery log created successfully", deliveryLog });
    }

    async show(request: Request, response: Response) {
        const paramsSchema = z.object({
            deliveryId: z.string().trim().uuid(),
        });

        const { deliveryId } = paramsSchema.parse(request.params);
        const delivery= await prisma.delivery.findUnique({
            where: { id: deliveryId },
            include: {
                logs: true,
                user: true
            },
        });

        if (!delivery) {
            throw new AppError("Delivery not found", 404);
        }

        if (request.user?.role === "Customer" && request.user.id !== delivery?.userId) {
            throw new AppError("The user can only access their own deliveries", 403);
        }

        return response.json({ delivery });
    }
}

export { DeliveriesLogsController };