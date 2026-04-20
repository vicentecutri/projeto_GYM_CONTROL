import { Request, Response, NextFunction } from "express";

export const is = (rolesPermitidas: string[]) =>{
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;

        if (!user) {
            return res.status(401).json({ message: "Token de autenticação ausente" });
        }
        if (!rolesPermitidas.includes(user.tipo)) {
            return res.status(403).json({ message: 'Esta rota é exclusiva para: ${rolesPermitidas.join(", ")}'
            });
        
        } 
        return next();
    }
}