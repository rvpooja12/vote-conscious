# Stage 1: Build with the full Node image to avoid missing build tools
FROM node:20 AS build
WORKDIR /app

# Prevent the build from crashing on minor warnings
ENV CI=false
# Increase memory limit for the bundler
ENV NODE_OPTIONS="--max-old-space-size=4096"

COPY package*.json ./
# Clean install
RUN npm ci

COPY . .

# Step 2: The "Detective" Build
# We run the build and if it fails, we list files to find case-sensitivity issues
RUN npm run build || (ls -R src && exit 1)

# Stage 3: Production Environment
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
RUN sed -i 's/listen[[:space:]]*80;/listen 8080;/g' /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
