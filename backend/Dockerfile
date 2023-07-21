# Define the base image
FROM node:18.16-alpine3.17

# Create a new user and group 'dbuser'
RUN addgroup -S expressuser && adduser -S expressuser -G expressuser

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
RUN chown -R expressuser:expressuser /app
USER expressuser
RUN npm run build

# Switch back to root to prune development dependencies
USER root
RUN npm prune --production

# Change the ownership of the directory to 'expressuser'
RUN mkdir -p /etc/certs && chown -R expressuser:expressuser /etc/certs

# Switch back to 'expressuser'
USER expressuser

# The command to start the application
CMD [ "npm", "run", "start:prod" ]
