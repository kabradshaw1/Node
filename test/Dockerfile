# Define the base image
FROM node:18.16-alpine3.17

# Set the working directory in the Docker image
WORKDIR /app

# Copy package.json and package-lock.json (if available) into the Docker image
COPY package*.json ./

# Install all dependencies inside the Docker image
RUN npm install

# Globally install TypeScript in the Docker image
RUN npm install -g typescript

# Copy the rest of the application into the Docker image
COPY . .

# Build the application
RUN npm run start