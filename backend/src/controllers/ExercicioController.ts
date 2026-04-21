import { Request, Response } from "express";
import { ExercicioService } from "../services/ExercicioService";

const exercicioService = new ExercicioService();

export class ExercicioController {

    async create(req: Request, res: Response) {
        const { nome, grupo_muscular, descricao } = req.body;
        try {
            const exercicio = await exercicioService.create({ nome, grupo_muscular, descricao });
            return res.status(201).json(exercicio);
        } catch (error: any) {
            return res.status(400).json({ error: error.message  });
        }
    }

    async listAll(req: Request, res: Response) {
        const exercicios = await exercicioService.listAll();
        return res.status(200).json(exercicios);    
    }

    async update(req: Request, res: Response) {
        const { id } = req.params;
        const { nome, grupo_muscular, descricao } = req.body;
        try {
            const exercicio = await exercicioService.update(Number(id), { nome, grupo_muscular, descricao });
            return res.status(200).json(exercicio);
        } catch (error: any) {
            return res.status(400).json({ error: error.message  });
        }
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params;
        try {
            await exercicioService.delete(Number(id));
            return res.status(204).json();
        } catch (error: any) {
            return res.status(400).json({ error: error.message  });
        }
    }

}