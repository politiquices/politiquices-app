FROM node:19-alpine

WORKDIR /app

COPY package.json ./

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
