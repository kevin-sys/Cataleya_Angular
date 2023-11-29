# Etapa de construcción (Build Stage)
FROM node:18.15.0 AS build

WORKDIR /app

# Copia los archivos necesarios para la construcción
COPY package.json package-lock.json /app/

# Instala las dependencias
RUN npm install

# Copia el código fuente de la aplicación
COPY . /app/

# Construye la aplicación Angular
RUN npm run build -- --output-path=./dist

# Etapa de producción
FROM nginx:alpine

# Copia los archivos estáticos generados en la etapa de construcción
COPY --from=build /app/dist /usr/share/nginx/html

# Expone el puerto 80 (por defecto en NGINX)
EXPOSE 80

# Comando para iniciar NGINX al correr el contenedor
CMD ["nginx", "-g", "daemon off;"]
