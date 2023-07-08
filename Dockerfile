FROM node:18.16-alpine3.17
WORKDIR /app
COPY package*.json ./
COPY ./backend/package*.json ./backend/
COPY ./frontend/package*.json ./frontend/
RUN npm i
RUN npm i -g typescript
COPY ./backend ./backend
COPY ./frontend ./frontend
