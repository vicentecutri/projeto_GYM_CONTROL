import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../middleware/AuthMiddleware";
import { is } from "../middleware/RoleMiddleware";

const router = Router();
const userController = new UserController();

router.post("/", authMiddleware, is([ "admin","recepcao"]), userController.create);
router.get("/", authMiddleware, is(["instrutor", "admin","recepcao"]), userController.listAll);
router.put("/:id", authMiddleware, is([ "admin","recepcao"]), userController.update);
router.delete("/:id", authMiddleware, is([ "admin","recepcao"]), userController.delete);
router.get("/me", authMiddleware, is(["instrutor", "admin", "aluno", "recepcao"])  ,userController.me);
router.get("/:id", authMiddleware, is(["instrutor", "admin","recepcao"]), userController.findById);
router.get("/alunos", authMiddleware, is(["instrutor", "admin", "recepcao"]), userController.getAlunos);

export default router;
