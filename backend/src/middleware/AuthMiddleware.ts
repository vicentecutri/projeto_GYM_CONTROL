import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
  id: string;
  tipo: string;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token de autenticação ausente" });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    return res.status(401).json({ message: "Erro no formato do token" });
  }

  const token = parts[1];
  
  if (!token) {
    return res.status(401).json({ message: "Token de autenticação ausente" });
  }
  try {
    const secret = (process.env.JWT_SECRET) as string;
    const decoded = jwt.verify(token, secret) as unknown as TokenPayload;
    
    (req as any).user = {
      id: decoded.id,
      tipo: decoded.tipo,
    };

    return next();
  } catch (error: any) {
    return res.status(401).json({ message: "Token de autenticação inválido" });
  }
};
