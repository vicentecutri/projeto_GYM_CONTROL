import { z } from "zod";

export const idParamSchema = z.string().uuid({ message: "ID inválido: formato UUID esperado" });