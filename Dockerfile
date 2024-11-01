# Use the official Node.js image to build the app
FROM node:16 AS builder

# Set the working directory
WORKDIR /docility

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app for production
RUN npm run build

# Use Nginx to serve the app
FROM nginx:alpine

# Copy built assets from the builder stage
COPY --from=builder /docility/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
