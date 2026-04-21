import { Request, Response } from "express";
import { userSchema, updateUserSchema } from "../middleware/UserSchema";
import { idParamSchema } from "../middleware/IdSchema";
import { UserService } from "../services/UserService";

const userService = new UserService();

export class UserController {
  async create(req: Request, res: Response) {
    try {
      req.body.tipo = req.body.tipo.toLowerCase();
      const dadosValidados = userSchema.parse(req.body);
      const novoUsuario = await userService.create(dadosValidados);

      return res.status(201).json(novoUsuario);
    } catch (error: any) {
      if (error.name == "ZodError") {
        return res.status(400).json({
          mensagem: "Dados invalidos",
          erros: error.issues.map((err: any) => ({
            campo: err.path.join("."),
            mensagem: err.message,
          })),
        });
      }
      return res.status(500).json({ message: error.message });
    }
  }

  async listAll(req: Request, res: Response) {
    try {
      const users = await userService.listAll();
      return res.status(200).json(users);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res
          .status(400)
          .json({ error: "O parâmetro ID é obrigatório na URL" });
      }
      const idValido = idParamSchema.parse(id);

      const user = await userService.findById(idValido);

      return res.status(200).json(user);
    } catch (error: any) {
      if(error.message == "id inexistente") {
        return res.status(404).json({
          error: "Nenhum usuário encontrado com o ID informado",
        });
      }
      if (error.name == "ZodError") {
        return res.status(400).json({
          error: "Dados inválidos",
          detalhes: error.issues.map((e: any) => e.message),
        });
      }
      return res.status(500).json({ error: error.message, message: error });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) {
        return res
          .status(400)
          .json({ error: "O parâmetro ID é obrigatório na URL" });
      }
      const idValido = idParamSchema.parse(id);

      const dadosValidados = updateUserSchema.parse(req.body);

      const updataUser = await userService.update(idValido, dadosValidados);
      return res.status(200).json(updataUser);
    } catch (error: any) {
      if (error.name == "ZodError") {
        return res.status(400).json({
          error: "Dados inválidos",
          detalhes: error.issues.map((e: any) => e.message),
        });
      }
      if (error.message == "id inexistente") {
        return res.status(404).json({
          error: "Nenhum usuário encontrado com o ID informado",
        });
      }
      return res.status(500).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const idValido = idParamSchema.parse(id);

      await userService.delete(idValido);
      return res.status(204).send();
    } catch (error: any) {
      if (error.message == "id inexistente") {
        return res.status(404).json({
          error: "Nenhum usuário encontrado com o ID informado",
        });
      }
      return res.status(500).json({ error: error.message });
    }
  }

  async me(req: Request, res: Response) {
    try {
      const user_id = (req as any).user.id;
      const user = await userService.me(user_id);
      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(500).json({ message: error.message , error: error });
    }
  }

  async getAlunos(req: Request, res: Response) {
    try {
      const alunos = await userService.getAluno();
      return res.status(200).json(alunos);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

}