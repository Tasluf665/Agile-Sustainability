# Use Node.js alpine (latest) as base image
FROM node:alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (including production only)
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Install a simple web server for serving static files
RUN npm install -g serve

# Expose the port the app runs on (Vite's default is 5173)
EXPOSE 5173

# Start the application using serve
# -s flag for SPA routing
# -l flag to specify port
CMD ["serve", "-s", "dist", "-l", "5173"]
