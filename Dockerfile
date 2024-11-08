# Dockerfile

# Use the official Node.js image to build the app
FROM node:18 AS builder

# Set the working directory
WORKDIR /docility

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the .env file if it exists
COPY .env ./

# Copy the rest of the application code
COPY . .

# Build the Vue.js app
RUN npm run build

# Use Nginx to serve the app
FROM nginx:alpine   

# Copy the built files from the builder stage
COPY --from=builder /docility/dist /usr/share/nginx/html

# Copy the custom default.conf
COPY default.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
