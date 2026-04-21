import { Request, Response } from "express";
import { PlanoService } from "../services/PlanoService";

const planoService = new PlanoService();


export class PlanoController {
    async getPlano(req: Request, res: Response) {
        try {
            const planos = await planoService.getPlano();
            return res.status(200).json(planos);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async criarPlano(req: Request, res: Response) {
        try {
            const { nome, preco, duracao_meses } = req.body;
            const plano = await planoService.criarPlano({ nome, preco, duracao_meses });
            return res.status(201).json(plano);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async desativarPlano(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const plano = await planoService.desativar(Number(id));
            return res.status(200).json(plano);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

}