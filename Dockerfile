# Copied Mainly From https://jsramblings.com/dockerizing-a-react-app/

# ==== CONFIGURE =====
# Use a Node 16 base image
FROM node:19-alpine as builder
# Set the working directory to /docker-workdir inside the container
WORKDIR /app
# Copy Files from Current Working Directory to Docker Image
COPY . .

# ==== BUILD =====
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm i
# Build the app
RUN npm run build

# ==== NGINX ====
FROM nginx:1.21.0-alpine as production
# Set Node Environment Var to Production
ENV NODE_ENV production

# Copy built assets from `builder` image
COPY --from=builder /app/build /usr/share/nginx/html
# Add your nginx.conf
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

# ==== Run ====
# Expose port
EXPOSE 8080
# Start nginx
CMD ["nginx", "-g", "daemon off;"]
