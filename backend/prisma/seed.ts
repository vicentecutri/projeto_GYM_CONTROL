import  { prisma } from "../src/config/prisma";
import bcrypt from "bcrypt";

async function main() {
  console.log('Semeando planos...');

  await prisma.planos.createMany({
    data: [
      { nome: 'Mensal', preco: 120.00, duracao_meses: 1 },
      { nome: 'Trimestral', preco: 300.00, duracao_meses: 3 },
      { nome: 'Anual', preco: 1000.00, duracao_meses: 12 },
    ],
    skipDuplicates: true,
  });

  const senha = 'admin123';
  const saltRounds = 10;
  const senhaCriptografada = await bcrypt.hash(senha, saltRounds);
  await prisma.usuarios.upsert({
    where: { email: 'admin@gymcontrol.com' },
    update: {},
    create: {
      email: 'admin@gymcontrol.com',
      nome: 'Administrador',
      senha_hash:  senhaCriptografada, 
      tipo: 'admin',
    },
  })

}


main()
  .catch((e) => {
    console.error("Erro no Seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    // Opcional: Se sua instância global não deve ser fechada, 
    // tome cuidado aqui. Mas para scripts de seed, o disconnect é boa prática.
    await prisma.$disconnect();
  });