import { Router } from "express";
import { TreinoController} from "../controllers/TreinoController";
import { authMiddleware } from "../middleware/AuthMiddleware";
import { is } from "../middleware/RoleMiddleware";

const router = Router();
const treinoController = new TreinoController();

router.post("/", authMiddleware, is(["instrutor", "admin"]), treinoController.store);
router.get("/aluno/:aluno_id", authMiddleware, is(["instrutor", "admin", "aluno"]), treinoController.index);
router.put("/:id", authMiddleware, is(["instrutor", "admin"]), treinoController.update);
router.delete("/:id", authMiddleware, is(["instrutor", "admin"]), treinoController.delete);

export default router;