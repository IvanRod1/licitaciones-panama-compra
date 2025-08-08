# Imagen base con Node + Chromium
FROM node:20-slim

RUN apt-get update && apt-get install -y \
    chromium \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    --no-install-recommends \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Crear el directorio de la app
WORKDIR /usr/src/app

# Copiar los archivos
COPY package*.json ./
RUN npm install

COPY . .

# Ejecutar tu script
CMD ["node", "licitacionesPC.js"]
