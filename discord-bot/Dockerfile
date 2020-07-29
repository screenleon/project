FROM node:12.18.1-slim

WORKDIR /Discord-Bot

COPY . .
# COPY ./src/ ./
# COPY ./package.json ./
# COPY ./.env ./

RUN apt-get update && apt-get install -y git python make g++ && npm install --build-from-source
ENTRYPOINT [ "npm", "run", "start:build" ]