import { prisma } from "../config/prisma";

export class PlanoService {
    async getPlano() {
        return await prisma.planos.findMany({
           where: { ativo: true },
        });
    }

    async desativar(id: number) {
        return await prisma.planos.update({
            where: {
                id,
            },
            data: {
                ativo: false,
            },
        });
    }

  async criarPlano({ nome, preco, duracao_meses }: any) {
    return await prisma.planos.create({
      data: {
        nome,
        preco,
        duracao_meses,
      },
    });
  }  

}