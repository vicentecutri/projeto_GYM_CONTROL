import { Router } from "express";
import { ExercicioController } from "../controllers/ExercicioController";
import { authMiddleware } from "../middleware/AuthMiddleware";
import { is } from "../middleware/RoleMiddleware";


const router = Router();
const exercicioController = new ExercicioController();

router.post("/", authMiddleware, is(["instrutor", "admin"]), exercicioController.create);
router.get("/", authMiddleware, exercicioController.listAll);

export default router;