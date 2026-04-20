import { prisma } from "../config/prisma";
import bcrypt from "bcrypt";

export class UserService {
  async create(data: any) {
    const userExists = await prisma.usuarios.findUnique({
      where: {
        email: data.email,
      },
    });
    if (userExists) throw new Error("Usuário já cadastrado");

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.senha, saltRounds);
    const user = await prisma.usuarios.create({
      data: {
        nome: data.nome,
        email: data.email,
        senha_hash: hashedPassword,
        tipo: data.tipo || "aluno",
      },
    });
   
    return { ...user, senha_hash: undefined };
  }

  async listAll() {
    return await prisma.usuarios.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        data_criacao: true,
      },
    });
  }

  async findById(id: string) {
    const user = await prisma.usuarios.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        data_criacao: true,
      },
    });
    if (user === null) {
      throw new Error("id inexistente");
    }
    return user;
  }

  async update(id: string, data: any) {
    try {
      return await prisma.usuarios.update({
        where: { id },
        data: {
          nome: data.nome,
          email: data.email,
          tipo: data.tipo,
        },
        select: {
          id: true,
          nome: true,
          email: true,
          tipo: true,
          data_criacao: true,
        },
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new Error("id inexistente");
      }
      // Se for outro erro, lança para frente
      throw error;
    }
  }

  async delete(id: string) {
    try {
      return await prisma.usuarios.delete({
        where: {
          id,
        },
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new Error("id inexistente");
      }
      // Se for outro erro, lança para frente
      throw error;
    }
  }
}
