import { Router } from "express";
import { PlanoController } from "../controllers/PlanoController";
import { authMiddleware } from "../middleware/AuthMiddleware";
import { is } from "../middleware/RoleMiddleware";

const router = Router();
const planoController = new PlanoController();

router.get("/", authMiddleware, is(["instrutor", "admin", "recepcao",  "aluno"]), planoController.getPlano);
router.post("/", authMiddleware, is(["recepcao", "admin"]), planoController.criarPlano);
router.delete("/:id", authMiddleware, is(["recepcao", "admin"]), planoController.desativarPlano);

export default router;