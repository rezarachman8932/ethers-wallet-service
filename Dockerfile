FROM node:21-alpine
WORKDIR /usr/src/app
ENV HOST=0.0.0.0
ENV PORT=3000
COPY ./package*.json ./
# Conditional: use npm ci if package-lock.json exists, else npm install
RUN sh -c 'if [ -f package-lock.json ]; then echo "Found package-lock.json, running npm ci"; npm ci; else echo "No package-lock.json found, running npm install"; npm install; fi'
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]
