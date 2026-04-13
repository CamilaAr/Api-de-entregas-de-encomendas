import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod";

class DeliveriesStatusController {
    async update(request: Request, response: Response) {
        const paramsSchema = z.object({
            id: z.string().trim().uuid(),
        });

        const bodySchema = z.object({
            status: z.enum(["processing", "shipped", "delivered"]),
        });

        const { id } = paramsSchema.parse(request.params);
        const { status } = bodySchema.parse(request.body);

        const delivery = await prisma.delivery.update({
            where: { id },
            data: { status },
        });

        await prisma.deliveryLog.create({
            data: {
                description: `Delivery status updated to ${status}`,
                deliveryId: id,
            },
        });

        return response.json({ message: "Delivery status updated successfully", delivery });
    }
}

export { DeliveriesStatusController };