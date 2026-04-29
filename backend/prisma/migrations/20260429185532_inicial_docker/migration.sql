-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('aluno', 'instrutor', 'admin', 'recepcao');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "senha_hash" VARCHAR(255) NOT NULL,
    "tipo" "UserType" NOT NULL DEFAULT 'aluno',
    "data_criacao" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercicios" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "grupo_muscular" VARCHAR(50) NOT NULL,
    "descricao" TEXT,

    CONSTRAINT "exercicios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "treinos" (
    "id" SERIAL NOT NULL,
    "aluno_id" TEXT NOT NULL,
    "instrutor_id" TEXT NOT NULL,
    "titulo" VARCHAR(50) NOT NULL,
    "data_criacao" DATE DEFAULT CURRENT_DATE,
    "ativo" BOOLEAN DEFAULT true,

    CONSTRAINT "treinos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itens_treino" (
    "id" SERIAL NOT NULL,
    "treino_id" INTEGER NOT NULL,
    "exercicio_id" INTEGER NOT NULL,
    "series" INTEGER NOT NULL,
    "repeticoes" VARCHAR(20),
    "carga" VARCHAR(20),
    "descanso_segundos" INTEGER DEFAULT 60,

    CONSTRAINT "itens_treino_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planos" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(50) NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "duracao_meses" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "planos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matriculas" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "plano_id" INTEGER NOT NULL,
    "data_inicio" DATE NOT NULL DEFAULT CURRENT_DATE,
    "data_fim" DATE NOT NULL,
    "status" VARCHAR(20) DEFAULT 'ativa',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "matriculas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagamentos" (
    "id" TEXT NOT NULL,
    "matricula_id" TEXT NOT NULL,
    "valor_pago" DECIMAL(10,2) NOT NULL,
    "metodo_pagamento" VARCHAR(30) NOT NULL,
    "data_pagamento" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pagamentos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "treinos" ADD CONSTRAINT "treinos_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "treinos" ADD CONSTRAINT "treinos_instrutor_id_fkey" FOREIGN KEY ("instrutor_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_treino" ADD CONSTRAINT "itens_treino_exercicio_id_fkey" FOREIGN KEY ("exercicio_id") REFERENCES "exercicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_treino" ADD CONSTRAINT "itens_treino_treino_id_fkey" FOREIGN KEY ("treino_id") REFERENCES "treinos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matriculas" ADD CONSTRAINT "matriculas_plano_id_fkey" FOREIGN KEY ("plano_id") REFERENCES "planos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matriculas" ADD CONSTRAINT "matriculas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagamentos" ADD CONSTRAINT "pagamentos_matricula_id_fkey" FOREIGN KEY ("matricula_id") REFERENCES "matriculas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
