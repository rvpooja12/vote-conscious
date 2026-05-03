# Stage 1: Build
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production Environment
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Required for Google Cloud Run Port 8080
EXPOSE 8080
RUN sed -i 's/listen[[:space:]]*80;/listen 8080;/g' /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
