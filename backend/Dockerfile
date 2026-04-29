# Usa uma versão estável do Node
FROM node:20

# Cria a pasta do app dentro do container
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos (incluindo a pasta prisma)
COPY . .

ARG DATABASE_URL="postgresql://user:pass@localhost:5432/db"
RUN npx prisma generate



# Expõe a porta que você usa (ex: 3333)
EXPOSE 8888

CMD /bin/sh -c "sleep 10 && npx prisma migrate deploy && npm run dev"

# Comando para rodar a aplicação
CMD ["npm", "run", "dev"]