import { Request, Response } from "express";
import { TreinoService } from "../services/TreinoService";

const treinoService = new TreinoService();

export class TreinoController {
  async store(req: Request, res: Response) {
    const { aluno_id, titulo, itens } = req.body;
    const instrutor_id = (req as any).user.id;
    try {
      const treino = await treinoService.create({
        aluno_id,
        instrutor_id,
        titulo,
        itens: itens,
      });
      return res.status(201).json(treino);
    } catch (error: any) {
      return res
        .status(400)
        .json({ mensage: "Erro ao criar treino", error: error.message });
    }
  }

  async index(req: Request, res: Response) {
    try {
      const aluno_id = (req as any).user.id;
      const treinos = await treinoService.getTreinosPorAluno(aluno_id);
      return res.json(treinos);
    } catch (error: any) {
      return res.status(400).json({ mensage: "Erro ao buscar treinos" });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { titulo, itens } = req.body;
    try {
      const treino = await treinoService.update(Number(id), { titulo, itens });
      return res.status(200).json(treino);
    } catch (error: any) {
      return res
        .status(400)
        .json({ mensage: "Erro ao atualizar treino", error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await treinoService.delete(Number(id));
      return res.status(204).json();
    } catch (error: any) {
      return res
        .status(400)
        .json({ mensage: "Erro ao deletar treino", error: error.message });
    }
  }

}
