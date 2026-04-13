import { app } from "@/app";
import { authConfig } from "@/configs/auth";
import { AppError } from "@/utils/AppError";
import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface TokenPayload {
    sub: string;
    role: string;

}

function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
    try {
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new AppError("JWT token not found", 401);
        }

        const [, token] = authHeader.split(" ");
        
        const {role, sub: userId} = verify(token, authConfig.jwt.secret) as TokenPayload;


        request.user = {

            id: userId,
            role,
        };

        return next();
    } catch (error) {
        throw new AppError("Invalid JWT token", 401);
    }
}

export { ensureAuthenticated };