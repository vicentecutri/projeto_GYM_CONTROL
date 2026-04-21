import { Router } from "express";
import { MatriculaController } from "../controllers/MatriculaController";
import { authMiddleware } from "../middleware/AuthMiddleware";
import { is } from "../middleware/RoleMiddleware";

const router = Router();
const matriculaController = new MatriculaController();

router.post("/", authMiddleware, is(["recepcao", "admin"]), matriculaController.novaMatricula);
router.get("/", authMiddleware, is(["recepcao", "admin"]), matriculaController.listarMatriculas);
router.put("/:id", authMiddleware, is(["recepcao", "admin"]), matriculaController.atualizarMatricula);
router.delete("/:id", authMiddleware, is(["recepcao", "admin"]), matriculaController.deletarMatricula);
router.get("/acesso/:id", authMiddleware, is(["recepcao", "admin"]), matriculaController.verificarAcesso);

export default router;