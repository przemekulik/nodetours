# Build application container image
FROM alpine:latest as container
RUN apk add --update --no-cache npm

# Install on the container
FROM container
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 7777
CMD [ "node", "server.js" ]