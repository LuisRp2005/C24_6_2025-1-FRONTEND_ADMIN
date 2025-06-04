# Etapa 1: Construcción de la app
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
COPY .env .env
RUN npm run build

# Etapa 2: Servir con NGINX
FROM nginx:stable-alpine

# Copiamos el archivo custom de NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos los archivos compilados al directorio público de NGINX
COPY --from=builder /app/build /usr/share/nginx/html

# Expone el puerto por defecto de nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]