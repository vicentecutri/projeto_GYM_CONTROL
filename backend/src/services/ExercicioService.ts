import { prisma } from "../config/prisma";

interface CreateExercicioDTO {
  nome: string;
  grupo_muscular: string;
  descricao: string;
}

export class ExercicioService {
  async create({nome, grupo_muscular, descricao}: CreateExercicioDTO) {
    const exercicio = await prisma.exercicios.create({
      data: {
        nome,
        grupo_muscular,
        descricao,
      }
    });

    return exercicio;
  }

  async listAll() {
    return await prisma.exercicios.findMany({
        orderBy: {
            nome: 'asc'
        }
    });
  }

  async update(id: number, {nome, grupo_muscular, descricao}: any) {
    return await prisma.exercicios.update({
      where: {
        id
      },
      data: {
        nome,
        grupo_muscular,
        descricao
      }
    });
  }

  async delete(id: number) {
    return await prisma.exercicios.delete({
      where: {
        id
      }
    });
  }

}
