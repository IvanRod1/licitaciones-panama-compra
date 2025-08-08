# Usa Node oficial
FROM node:20

# Crea carpeta para app
WORKDIR /usr/src/app

# Copia archivos
COPY package*.json ./
COPY licitacionesPC.cjs ./

# Instala Puppeteer (con Chromium incluido)
RUN npm install

# Expone el puerto si lo necesitás (opcional)
# EXPOSE 3000

# Comando por defecto
CMD [ "npm", "start" ]

