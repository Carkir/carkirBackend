FROM node:16
WORKDIR /usr/src/app
ARG buildtime_variable=default_value 
ENV CONNECTION_STRING=$buildtime_variable

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080
CMD ["node", "server.js"]