import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { z } from "zod";
import { compare } from "bcrypt";
import { authConfig } from "@/configs/auth";
import { sign } from "jsonwebtoken";

class SessionsController {
 async create(request: Request, response: Response) {
    const bodySchema = z.object({

        email: z.string().trim().email(),
        password: z.string().trim().min(6),
    });

    const { email, password } = bodySchema.parse(request.body);

    const user = await prisma.user.findFirst({ where: { email } });

    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
        throw new AppError("Invalid email or password", 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({role: user.role ?? "Customer"}, secret, { 
        expiresIn,
        subject: user.id,
    });

    const { password: _, ...userWithoutPassword } = user;

    return response.json({ message: "Session created successfully", token, user: userWithoutPassword });
    }
}

export { SessionsController };