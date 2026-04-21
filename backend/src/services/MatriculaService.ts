import { prisma } from "../config/prisma";

export class MatriculaService {
  async create(aluno_id: string, plano_id: number) {
   const [plano, aluno] = await Promise.all([
      prisma.planos.findUnique({ where: { id: plano_id } }),
      prisma.usuarios.findUnique({ where: { id: aluno_id } })
    ]);

    if(!plano) {
      throw new Error("Plano não encontrado");
    }
    if(!aluno || aluno.tipo !== "aluno") {
      throw new Error("Aluno não encontrado ou não é um aluno");
    }

    const matriculaAtiva = await prisma.matriculas.findFirst({
      where: {
        usuario_id: aluno_id,
        status: "ativa",
      },
    });

    if (matriculaAtiva) {
      throw new Error("O aluno já possui uma matrícula ativa");
    }

    
    const data_inicio = new Date();
    const data_fim = new Date();
    data_fim.setMonth(data_inicio.getMonth() + plano.duracao_meses);
    
    const resultado = await prisma.$transaction(async (tx) => {
      
      const novaMatricula = await tx.matriculas.create({
        data: {
          usuario_id: aluno_id,
          plano_id,
          data_inicio: data_inicio,
          data_fim: data_fim,
          status: "ativa"
        }
      });

      const novoPagamento = await tx.pagamentos.create({
        data: {
          matricula_id: novaMatricula.id,
          valor_pago: plano.preco,
          metodo_pagamento: "pix", // Isso viria do corpo da requisição
        }
      });

      return { novaMatricula, novoPagamento };
    });

    return { matricula: resultado.novaMatricula, pagamento: resultado.novoPagamento };
  }

  async getMatriculas() {
    return await prisma.matriculas.findMany(
      { include: {
        usuarios:{ select: { nome: true, email: true } },
        plano: { select: { nome: true, preco: true } }
      }, orderBy: { data_inicio: 'desc' }
      }
    );
  }

  async atualizarMatricula(id: string, status: string) {
    return await prisma.matriculas.update({
      where: {
        id
      },
      data: {
        status
      }
    });
  }

  async cancelarMatricula(id: string) {
    return await prisma.matriculas.update({
      where: {
        id
      },
      data: {
        status: "cancelada"
      }
    });
  }

  async virificarAcesso(id: string) {
    const matricula = await prisma.matriculas.findFirst({
      where: {
        usuario_id : id, status: "ativa"
      }, orderBy: { data_inicio: 'desc' }
    });

    if(!matricula) {
      return {liberado: false, message: "Matricula não encontrada"};
    }

    const hoje = new Date();

    if(hoje > matricula.data_fim) {
      return {liberado: false, message: "Matricula expirada"};
    }

    return {liberado: true, message: "Matricula ativa"}

  }

}
