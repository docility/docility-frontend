# Use the official Node.js image as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Build the Vue.js application
RUN npm run build

# Install NGINX to serve the built app
RUN apt-get update && apt-get install -y nginx

# Copy the built app to NGINX's public folder
COPY dist /usr/share/nginx/html

# Expose the port NGINX is listening on
EXPOSE 80

# Start NGINX when the container launches
CMD ["nginx", "-g", "daemon off;"]
