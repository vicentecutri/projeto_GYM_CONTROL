import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

const authService = new AuthService();

export class AuthController {
    async login(req: Request, res: Response) {
        try {
            const { email, senha } = req.body;
            const result = await authService.execute({ email, senha });
            return res.status(200).json(result);
        } catch (error: any) {
            return res.status(401).json({ mensagem: error.message });
        }
    }
}