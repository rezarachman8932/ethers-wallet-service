FROM node:21-alpine
WORKDIR /usr/src/app
ENV HOST=0.0.0.0
ENV PORT=3000
COPY ./package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]
