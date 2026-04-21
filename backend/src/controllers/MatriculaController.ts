import { Request, Response } from "express";
import { MatriculaService } from "../services/MatriculaService";
import { idParamSchema } from "../middleware/IdSchema";

const matriculaService = new MatriculaService();

export class MatriculaController {
    async novaMatricula(req: Request, res: Response) {
        const { aluno_id, plano_id } = req.body;
        try {
            const matricula = await matriculaService.create(aluno_id, plano_id);
            return res.status(201).json(matricula);
        } catch (error: any) {
            return res.status(400).json({ message: "Erro ao criar matricula", error: error.message });
        }
    }

    async listarMatriculas(req: Request, res: Response) {
        try {
            const matriculas = await matriculaService.getMatriculas();
            return res.status(200).json(matriculas);
        } catch (error: any) {
            return res.status(500).json({ message: "Erro ao listar matriculas", error: error.message });
        }
    }

    async atualizarMatricula(req: Request, res: Response) {
        const  id = idParamSchema.parse(req.params.id);
        const { status } = req.body;

        try {
            const matricula = await matriculaService.atualizarMatricula(id, status);
            return res.status(200).json(matricula);
        } catch (error: any) {
            return res.status(400).json({ message: "Erro ao atualizar matricula", error: error.message });
        }
    }

    async deletarMatricula(req: Request, res: Response) {
        const  id = idParamSchema.parse(req.params.id);
        try {
            await matriculaService.cancelarMatricula(id);
            return res.status(204).json();
        } catch (error: any) {
            return res.status(400).json({ message: "Erro ao deletar matricula", error: error.message });
        }
    }

    async verificarAcesso(req: Request, res: Response) {
        const  id = idParamSchema.parse(req.params.id);
        try {
            const acesso = await matriculaService.virificarAcesso(id);
            return res.status(200).json(acesso);
        } catch (error: any) {
            return res.status(400).json({ message: "Erro ao verificar acesso", error: error.message });
        }
    }

}