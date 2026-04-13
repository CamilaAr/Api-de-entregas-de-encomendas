import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod";


class DeliveriesController {
    async create(request: Request, response: Response) {
        const bodySchema = z.object({
            description: z.string().trim().min(1),
            userId: z.string().trim().uuid(),
        });

        const { description, userId } = bodySchema.parse(request.body);

        const delivery = await prisma.delivery.create({
            data: {
                description,
                userId,
            },
        });

        return response.status(201).json({ message: "Delivery created successfully", delivery });
    }

    async index(request: Request, response: Response) {
        const deliveries = await prisma.delivery.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });

        return response.json({ message: "Deliveries fetched successfully", deliveries });
    }

}

export { DeliveriesController };