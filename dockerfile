# Dockerfile
FROM node:18-alpine
WORKDIR /usr/src/app

# Instala dependências de produção
COPY package*.json ./
RUN npm install

# Copia o resto da aplicação
COPY . .

# Porta padrão
EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
