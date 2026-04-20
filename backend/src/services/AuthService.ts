import { prisma } from "../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface LoginDTO {
  email: string;
  senha: string;
}

export class AuthService {
  async execute({ email, senha }: LoginDTO) {
    const user = await prisma.usuarios.findUnique({
      where: {
        email,
      },
    });

    if (!user) throw new Error("Email ou senha inválidos");

    const passwordMatch = await bcrypt.compare(senha, user.senha_hash);

    if (!passwordMatch) throw new Error("Email ou senha inválidos");

    const token = jwt.sign({ id: user.id, tipo: user.tipo }, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });

    return {
      usuario: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo,
      },
      token,
    };
  }
}
