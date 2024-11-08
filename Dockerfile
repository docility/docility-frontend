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

# Make sure to set the environment variables before running the build
# You can pass environment variables directly into the Dockerfile build process or use the .env file
# Ensure Vue.js recognizes the env variables with "VUE_APP_" prefix
RUN npm run build

# Use Nginx to serve the app
FROM nginx:alpine   

# Copy built assets from the builder stage
COPY --from=builder /docility/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80
        
# Start Nginx   
CMD ["nginx", "-g", "daemon off;"]
