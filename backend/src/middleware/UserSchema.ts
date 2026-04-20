import { z } from "zod";


// 1. Criamos o "molde" (Schema) para o usuário
export const userSchema = z.object({
  
  // O nome precisa ser uma string e ter no mínimo 3 letras
  nome: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),

  // O Zod já checa se tem @, se tem domínio, etc.
  email: z.string().email( { message:"Formato de e-mail inválido"}),

  // A senha precisa ter um mínimo de segurança antes de ser criptografada
  senha: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),

  // O tipo só pode ser um desses três valores específicos
  tipo: z.enum(["aluno", "instrutor", "admin"], {
    error: () => ({ message: "Escolha entre ALUNO, INSTRUTOR ou ADMIN" }),
  }),
});

export const updateUserSchema = userSchema.partial(); // O .partial() faz todos os campos serem opcionais