FROM node:18.16-alpine3.17
WORKDIR /Dev
COPY package*.json ./
COPY frontend/package*.json ./frontend
COPY backend/package*.json ./backend
RUN npm i
RUN npm i -g typescript
