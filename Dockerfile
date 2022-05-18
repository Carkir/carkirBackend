FROM node:16
WORKDIR /usr/src/app
ARG buildtime_variable=mongodb+srv://carkirAdmin:armeldeafaldyfarhanyogayusuf@cluster0.xjc9q.mongodb.net/?retryWrites=true&w=majority
ENV CONNECTION_STRING=$buildtime_variable

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node", "server.js"]