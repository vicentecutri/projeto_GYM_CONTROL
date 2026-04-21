import { prisma } from "../config/prisma";

interface ItemTreinoDTO {
  exercicio_id: number;
  series: number;
  repeticoes: string;
  carga: string;
  descanso_segundos: number;
}

interface CreateTreinoDTO {
  aluno_id: string;
  instrutor_id: string;
  titulo: string;
  itens: ItemTreinoDTO[];
}
export class TreinoService {
  async create({ aluno_id, instrutor_id, titulo, itens }: CreateTreinoDTO) {
    const aluno = await prisma.usuarios.findUnique({
      where: {
        id: aluno_id,
      },
    });

    if (!aluno || aluno.tipo !== "aluno") {
      throw new Error("Aluno não encontrado ou não é um aluno");
    }

    if (
      itens.map((item) => item.exercicio_id).length !==
      new Set(itens.map((item) => item.exercicio_id)).size
    ) {
      throw new Error("Exercícios duplicados");
    }

    return await prisma.treinos.create({
      data: {
        aluno_id,
        instrutor_id,
        titulo,
        itens_treino: {
          create: itens.map((item) => ({
            exercicio_id: item.exercicio_id,
            series: item.series,
            repeticoes: item.repeticoes,
            carga: item.carga,
            descanso_segundos: item.descanso_segundos,
          })),
        },
      },
      include: {
        itens_treino: true,
      },
    });
  }
  async getTreinosPorAluno(aluno_id: string) {
    return await prisma.treinos.findMany({
      where: {
        aluno_id,
        ativo: true,
      },
      include: {
        itens_treino: {
          include: {
            exercicios: true,
          },
        },
        instrutor: { select: { nome: true } },
      },
    });
  }

  async update(id: number, { titulo, itens }: any) {
    return await prisma.treinos.update({
      where: {
        id,
      },
      data: {
        titulo,
        itens_treino: {
          deleteMany: {},
          create: itens.map((item: any) => ({
            exercicio_id: item.exercicio_id,
            series: item.series,
            repeticoes: item.repeticoes,
            carga: item.carga,
            descanso_segundos: item.descanso_segundos,
          })),
        },
      },
      include: {
        itens_treino: {
          include: {
            exercicios: true,
          },
        },
        instrutor: { select: { nome: true } },
      },
    });
  }

  async delete(id: number) {
    return await prisma.treinos.update({
      where: {
        id,
      },
      data: {
        ativo: false,
      },
    });
  }
}
